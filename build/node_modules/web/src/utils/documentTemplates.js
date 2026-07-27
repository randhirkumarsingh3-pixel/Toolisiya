/**
 * Common template styles and constants for document generators.
 */
export const TEMPLATES = {
  MODERN: 'Modern',
  CLASSIC: 'Classic',
  MINIMAL: 'Minimal',
  PROFESSIONAL: 'Professional',
  CREATIVE: 'Creative',
  DETAILED: 'Detailed',
  SIMPLE: 'Simple',
  ACADEMIC: 'Academic',
  ACHIEVEMENT: 'Achievement',
  APPRECIATION: 'Appreciation',
  BUSINESS: 'Business',
  FORMAL: 'Formal',
  INFORMAL: 'Informal',
  OFFICIAL: 'Official',
  SERVICE_AGREEMENT: 'Service Agreement',
  NDA: 'NDA',
  EMPLOYMENT: 'Employment',
  LEASE: 'Lease',
  INVOICE: 'Invoice',
  TAX_BILL: 'Tax Bill',
  SERVICE_BILL: 'Service Bill'
};

export const getTemplateClass = (templateName) => {
  switch (templateName) {
    case TEMPLATES.CLASSIC:
    case TEMPLATES.FORMAL:
    case TEMPLATES.ACADEMIC:
    case TEMPLATES.OFFICIAL:
    case TEMPLATES.NDA:
      return 'document-preview-serif';
    default:
      return 'font-sans';
  }
};