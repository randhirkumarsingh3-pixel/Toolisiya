import { supabase } from './supabaseClient';

function getCachedSession() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        const val = localStorage.getItem(key);
        if (val) {
          const data = JSON.parse(val);
          if (data && data.access_token && data.user) {
            return data;
          }
        }
      }
    }
  } catch (e) {
    console.error("Error reading cached Supabase session:", e);
  }
  return null;
}

function mapUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    username: user.user_metadata?.username || user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
    mobile: user.user_metadata?.mobile || '',
    name: user.user_metadata?.name || user.user_metadata?.username || '',
    collectionName: user.user_metadata?.role === 'admin' ? 'admin_users' : 'users',
    created: user.created_at,
    updated: user.updated_at,
  };
}

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
  if (cleanFilter.includes('&&')) {
    const parts = cleanFilter.split('&&');
    for (const part of parts) {
      query = applyFilter(query, part);
    }
    return query;
  }
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

class AuthStore {
  constructor() {
    this.listeners = [];

    // First check for admin session (backend JWT, stored separately)
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      try {
        const parsed = JSON.parse(adminSession);
        this.isValid = true;
        this.token = parsed.token;
        this.model = parsed.model;
      } catch(e) {
        localStorage.removeItem('admin_session');
        this.isValid = false;
        this.token = null;
        this.model = null;
      }
    } else {
      // Fall back to Supabase session (regular users)
      const cached = getCachedSession();
      if (cached) {
        this.isValid = true;
        this.token = cached.access_token;
        this.model = mapUser(cached.user);
      } else {
        this.isValid = false;
        this.token = null;
        this.model = null;
      }
    }

    supabase.auth.onAuthStateChange((event, session) => {
      // Only update if no admin session is active
      if (!localStorage.getItem('admin_session')) {
        if (session) {
          this.isValid = true;
          this.token = session.access_token;
          this.model = mapUser(session.user);
          
          // Ensure OAuth users are synced to the public.users table
          if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            const profileData = {
              id: session.user.id,
              email: session.user.email,
              username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || `user_${session.user.id.substring(0,8)}`,
              name: session.user.user_metadata?.name || session.user.user_metadata?.username || '',
              mobile: session.user.user_metadata?.mobile || null,
              password: 'oauth_user_no_password',
              tokenKey: Math.random().toString(36).substring(2, 15),
            };
            
            // Upsert the user profile without waiting for it to finish to avoid blocking the UI
            supabase.from('users').upsert(profileData, { onConflict: 'id' })
              .then(({ error }) => {
                if (error) console.error("Error syncing OAuth user to public.users:", error);
              });
          }
        } else {
          this.isValid = false;
          this.token = null;
          this.model = null;
        }
        this.triggerListeners();
      }
    });
  }

  triggerListeners() {
    this.listeners.forEach(cb => cb(this.token, this.model));
  }

  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  clear() {
    supabase.auth.signOut();
    this.isValid = false;
    this.token = null;
    this.model = null;
    // Clear admin session from localStorage too
    localStorage.removeItem('admin_session');
    this.triggerListeners();
  }

  // Called after successful backend API admin login
  saveAdmin(token, adminRecord) {
    this.isValid = true;
    this.token = token;
    this.model = adminRecord;
    // Persist admin session in localStorage so page refresh keeps them logged in
    localStorage.setItem('admin_session', JSON.stringify({ token, model: adminRecord }));
    this.triggerListeners();
  }
}

class Collection {
  constructor(name) {
    this.name = name;
    this.channels = {};
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
    if (error) throw new Error(error.message);
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
    if (error) throw new Error(error.message);
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
    if (error) throw new Error(error.message);
    return mapRecord(data);
  }

  async getFirstListItem(filter, options = {}) {
    let query = supabase.from(this.name).select('*');
    query = applyFilter(query, filter);
    const { data, error } = await query.limit(1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      const err = new Error("Record not found");
      err.status = 404;
      throw err;
    }
    return mapRecord(data[0]);
  }

  async create(data, options = {}) {
    if (this.name === 'users' && data.password) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            mobile: data.mobile,
            name: data.name || data.username,
          }
        }
      });
      if (authError) throw new Error(authError.message);

      const profileData = {
        id: authData.user.id,
        email: data.email,
        username: data.username,
        mobile: data.mobile,
        name: data.name || data.username,
      };
      const { error: profileError } = await supabase.from('users').upsert(profileData);
      if (profileError) console.error("Error creating user profile in table:", profileError);

      return mapUser(authData.user);
    }

    const insertData = { ...data };
    if (insertData.id === undefined || insertData.id === null || insertData.id === '') {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let newId = '';
      for (let i = 0; i < 15; i++) {
        newId += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      insertData.id = newId;
    }

    const { data: record, error } = await supabase.from(this.name).insert(insertData).select().single();
    if (error) throw new Error(error.message);
    return mapRecord(record);
  }

  async update(id, data, options = {}) {
    const { data: record, error } = await supabase.from(this.name).update(data).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return mapRecord(record);
  }

  async delete(id, options = {}) {
    const { error } = await supabase.from(this.name).delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }

  subscribe(topic, callback) {
    const channelName = `${this.name}_realtime_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: this.name }, (payload) => {
        const action = payload.eventType === 'INSERT' ? 'create' : payload.eventType === 'UPDATE' ? 'update' : 'delete';
        const record = mapRecord(payload.new || payload.old);
        callback({ action, record });
      })
      .subscribe();
    
    this.channels[topic] = channel;
    return channel;
  }

  unsubscribe(topic) {
    if (this.channels[topic]) {
      supabase.removeChannel(this.channels[topic]);
      delete this.channels[topic];
    }
  }

  async authWithPassword(email, password, options = {}) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    let mappedUser = mapUser(data.user);
    if (this.name === 'admin_users') {
      await supabase.auth.updateUser({ data: { role: 'admin' } });
      if (mappedUser) mappedUser.collectionName = 'admin_users';
    }

    return {
      token: data.session.access_token,
      record: mappedUser,
    };
  }

  async authWithOAuth2(options = {}) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: options.provider || 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw new Error(error.message);
    return data;
  }

  async requestOTP(email, options = {}) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    });
    if (error) throw new Error(error.message);
    return {
      otpId: email,
    };
  }

  async authWithOTP(otpId, code, options = {}) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: otpId,
      token: code,
      type: 'email',
    });
    if (error) throw new Error(error.message);
    return {
      token: data.session.access_token,
      record: mapUser(data.user),
    };
  }
}

class PocketBaseCompatibility {
  constructor() {
    this.authStore = new AuthStore();
    this.collections = {};
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new Collection(name);
    }
    return this.collections[name];
  }
}

const pocketbaseClient = new PocketBaseCompatibility();
export default pocketbaseClient;
export { pocketbaseClient };
