import { supabase } from './supabaseClient.js';
import logger from './logger.js';

async function seed() {
  logger.info('Starting seeding for PDF to Word converter tool...');
  
  // 1. Seed tools table
  const toolId = 'pdf-to-word-id-123'; // unique identifier
  const toolData = {
    id: toolId,
    category: 'PDF',
    name: 'PDF to Word',
    description: 'Convert PDF files into fully editable Microsoft Word documents while preserving layout, fonts, and images.',
    icon: 'FileText',
    status: 'active',
    url: '/pdf/pdf-to-word',
    show_in_menu: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  logger.info(`Checking if tool exists...`);
  const { data: existingTool, error: checkError } = await supabase
    .from('tools')
    .select('id')
    .eq('url', '/pdf/pdf-to-word')
    .maybeSingle();

  if (checkError) {
    logger.error('Error checking tools table:', checkError);
    process.exit(1);
  }

  if (!existingTool) {
    logger.info('Inserting PDF to Word tool...');
    const { error: insertError } = await supabase
      .from('tools')
      .insert([toolData]);

    if (insertError) {
      logger.error('Error inserting tool:', insertError);
      process.exit(1);
    }
    logger.info('Successfully inserted tool!');
  } else {
    logger.info('PDF to Word tool already exists, skipping insertion.');
  }

  // 2. Seed seo_settings table
  const seoData = {
    id: 'seo-pdf-to-word-123',
    page_name: 'pdf-to-word',
    canonical_url: 'https://toolisiya.com/pdf/pdf-to-word',
    meta_title: 'PDF to Word Converter Online Free | Toolisiya',
    meta_description: 'Convert PDF files to editable Word documents online for free while preserving formatting, tables, images, and layout using Toolisiya.',
    meta_keywords: 'pdf to word, convert pdf to docx, editable word converter, scanned pdf to word, online pdf converter, free pdf converter',
    og_title: 'PDF to Word Converter Online Free | Toolisiya',
    og_description: 'Convert PDF files to editable Word documents online for free while preserving formatting, tables, images, and layout using Toolisiya.',
    twitter_title: 'PDF to Word Converter Online Free | Toolisiya',
    twitter_description: 'Convert PDF files to editable Word documents online for free while preserving formatting, tables, images, and layout using Toolisiya.',
    is_published: true,
    h1_tag: 'Convert PDF to Word Online Free',
    faq_schema: {},
    tool_schema: {},
    structured_data: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  logger.info(`Checking if SEO settings exist...`);
  const { data: existingSeo, error: checkSeoError } = await supabase
    .from('seo_settings')
    .select('id')
    .eq('page_name', 'pdf-to-word')
    .maybeSingle();

  if (checkSeoError) {
    logger.error('Error checking seo_settings table:', checkSeoError);
    process.exit(1);
  }

  if (!existingSeo) {
    logger.info('Inserting PDF to Word SEO settings...');
    const { error: insertSeoError } = await supabase
      .from('seo_settings')
      .insert([seoData]);

    if (insertSeoError) {
      logger.error('Error inserting SEO settings:', insertSeoError);
      process.exit(1);
    }
    logger.info('Successfully inserted SEO settings!');
  } else {
    logger.info('PDF to Word SEO settings already exist, skipping insertion.');
  }

  logger.info('Seeding completed successfully!');
  process.exit(0);
}

seed();
