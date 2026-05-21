import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient.js';
import logger from './logger.js';

function mapRecord(record) {
  if (!record) return null;
  const result = { ...record };
  if (result.created_at !== undefined) {
    result.created = result.created_at;
  }
  if (result.updated_at !== undefined) {
    result.updated = result.updated_at;
  }
  return result;
}

function applyFilter(query, filter) {
  if (!filter) return query;
  const cleanFilter = filter.trim();

  // Handle OR (||)
  if (cleanFilter.includes('||')) {
    const parts = cleanFilter.split('||').map(p => p.trim());
    const orSpecs = parts.map(part => {
      const match = part.match(/^([\w_]+)\s*(>=|<=|!=|=|>|<)\s*(.+)$/);
      if (!match) return '';
      let [_, column, operator, value] = match;
      column = column.trim();
      operator = operator.trim();
      value = value.trim();

      if (column === 'created') column = 'created_at';
      if (column === 'updated') column = 'updated_at';

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      const opMap = {
        '=': 'eq',
        '!=': 'neq',
        '>=': 'gte',
        '<=': 'lte',
        '>': 'gt',
        '<': 'lt'
      };

      return `${column}.${opMap[operator] || 'eq'}.${value}`;
    }).filter(Boolean);

    return query.or(orSpecs.join(','));
  }

  // Handle AND (&&)
  if (cleanFilter.includes('&&')) {
    const parts = cleanFilter.split('&&');
    for (const part of parts) {
      query = applyFilter(query, part);
    }
    return query;
  }

  // Single comparison
  const match = cleanFilter.match(/^([\w_]+)\s*(>=|<=|!=|=|>|<)\s*(.+)$/);
  if (!match) return query;
  let [_, column, operator, value] = match;
  column = column.trim();
  operator = operator.trim();
  value = value.trim();

  if (column === 'created') column = 'created_at';
  if (column === 'updated') column = 'updated_at';

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  } else if (value.toLowerCase() === 'true') {
    value = true;
  } else if (value.toLowerCase() === 'false') {
    value = false;
  } else if (value.toLowerCase() === 'null') {
    value = null;
  } else if (/^\d+$/.test(value)) {
    value = parseInt(value, 10);
  } else if (/^\d+\.\d+$/.test(value)) {
    value = parseFloat(value);
  }

  switch (operator) {
    case '=':
      return value === null ? query.is(column, null) : query.eq(column, value);
    case '!=':
      return value === null ? query.not(column, 'is', null) : query.neq(column, value);
    case '>=':
      return query.gte(column, value);
    case '<=':
      return query.lte(column, value);
    case '>':
      return query.gt(column, value);
    case '<':
      return query.lt(column, value);
    default:
      return query;
  }
}

class Collection {
  constructor(name) {
    this.name = name;
  }

  async getFullList(options = {}) {
    let query = supabase.from(this.name).select('*');
    if (options.sort) {
      const sorts = options.sort.split(',');
      for (const s of sorts) {
        const desc = s.startsWith('-');
        const column = desc ? s.substring(1) : s;
        const mappedColumn = column === 'created' ? 'created_at' : column === 'updated' ? 'updated_at' : column;
        query = query.order(mappedColumn, { ascending: !desc });
      }
    }
    if (options.filter) {
      query = applyFilter(query, options.filter);
    }
    const { data, error } = await query;
    if (error) {
      logger.error(`Error in getFullList for ${this.name}:`, error.message);
      throw new Error(error.message);
    }
    return (data || []).map(mapRecord);
  }

  async getList(page = 1, perPage = 30, options = {}) {
    let query = supabase.from(this.name).select('*', { count: 'exact' });
    if (options.sort) {
      const sorts = options.sort.split(',');
      for (const s of sorts) {
        const desc = s.startsWith('-');
        const column = desc ? s.substring(1) : s;
        const mappedColumn = column === 'created' ? 'created_at' : column === 'updated' ? 'updated_at' : column;
        query = query.order(mappedColumn, { ascending: !desc });
      }
    }
    if (options.filter) {
      query = applyFilter(query, options.filter);
    }
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) {
      logger.error(`Error in getList for ${this.name}:`, error.message);
      throw new Error(error.message);
    }
    return {
      page,
      perPage,
      totalItems: count || 0,
      totalPages: Math.ceil((count || 0) / perPage),
      items: (data || []).map(mapRecord),
    };
  }

  async getOne(id, options = {}) {
    const { data, error } = await supabase.from(this.name).select('*').eq('id', id).single();
    if (error) {
      logger.error(`Error in getOne for ${this.name} (id: ${id}):`, error.message);
      throw new Error(error.message);
    }
    return mapRecord(data);
  }

  async getFirstListItem(filter, options = {}) {
    let query = supabase.from(this.name).select('*');
    query = applyFilter(query, filter);
    const { data, error } = await query.limit(1);
    if (error) {
      logger.error(`Error in getFirstListItem for ${this.name} (filter: ${filter}):`, error.message);
      throw new Error(error.message);
    }
    if (!data || data.length === 0) {
      const err = new Error("Record not found");
      err.status = 404;
      throw err;
    }
    return mapRecord(data[0]);
  }

  async create(data, options = {}) {
    // If we're creating a user with a password, handle Auth signup
    if ((this.name === 'users' || this.name === 'admin_users') && data.password && data.email) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          username: data.username,
          mobile: data.mobile || '',
          name: data.name || data.username || '',
          role: this.name === 'admin_users' ? 'admin' : 'user'
        }
      });
      if (authError) {
        logger.error(`Supabase Auth signup error:`, authError.message);
        throw new Error(authError.message);
      }

      // Write user/admin profile details into the respective table
      const profileData = {
        id: authData.user.id,
        email: data.email,
        username: data.username || data.email.split('@')[0],
        mobile: data.mobile || '',
        name: data.name || data.username || '',
        password: data.hashedPassword || (data.password ? bcrypt.hashSync(data.password, 10) : ''),
        tokenKey: data.tokenKey || Math.random().toString(36).substring(2, 15),
        ...(this.name === 'admin_users' && {
          role: data.role || 'admin',
          status: data.status || 'Active'
        })
      };

      const { data: insertedProfile, error: profileError } = await supabase
        .from(this.name)
        .upsert(profileData)
        .select()
        .single();

      if (profileError) {
        logger.error(`Supabase profile insertion error:`, profileError.message);
      }

      return mapRecord(insertedProfile || profileData);
    }

    const insertData = { ...data };
    if (!insertData.id) {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let newId = '';
      for (let i = 0; i < 15; i++) {
        newId += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      insertData.id = newId;
    }

    const { data: record, error } = await supabase.from(this.name).insert(insertData).select().single();
    if (error) {
      logger.error(`Error in create for ${this.name}:`, error.message);
      throw new Error(error.message);
    }
    return mapRecord(record);
  }

  async update(id, data, options = {}) {
    const { data: record, error } = await supabase.from(this.name).update(data).eq('id', id).select().single();
    if (error) {
      logger.error(`Error in update for ${this.name} (id: ${id}):`, error.message);
      throw new Error(error.message);
    }
    return mapRecord(record);
  }

  async delete(id, options = {}) {
    const { error } = await supabase.from(this.name).delete().eq('id', id);
    if (error) {
      logger.error(`Error in delete for ${this.name} (id: ${id}):`, error.message);
      throw new Error(error.message);
    }
    return true;
  }

  async authWithPassword(email, password, options = {}) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      logger.error(`Supabase authWithPassword failed for ${email}:`, error.message);
      throw new Error(error.message);
    }

    const profileName = this.name;
    const { data: profile, error: profileErr } = await supabase
      .from(profileName)
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileErr) {
      logger.warn(`Could not fetch profile for user ${data.user.id}:`, profileErr.message);
    }

    return {
      token: data.session.access_token,
      record: mapRecord(profile || { id: data.user.id, email }),
    };
  }

  async requestOTP(email, options = {}) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true
      }
    });
    if (error) {
      logger.error(`Supabase requestOTP failed for ${email}:`, error.message);
      throw new Error(error.message);
    }
    return {
      otpId: email
    };
  }

  async authWithOTP(otpId, code, options = {}) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: otpId,
      token: code,
      type: 'email'
    });
    if (error) {
      logger.error(`Supabase authWithOTP failed for ${otpId}:`, error.message);
      throw new Error(error.message);
    }

    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileErr) {
      logger.warn(`Could not fetch profile for verified OTP user ${data.user.id}:`, profileErr.message);
    }

    return {
      token: data.session.access_token,
      record: mapRecord(profile || { id: data.user.id, email: otpId })
    };
  }
}

class PocketBaseCompatibility {
  constructor() {
    this.collections = {};
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new Collection(name);
    }
    return this.collections[name];
  }

  autoCancellation() {
    return this;
  }
}

const pocketbaseClient = new PocketBaseCompatibility();
export default pocketbaseClient;
export { pocketbaseClient };
