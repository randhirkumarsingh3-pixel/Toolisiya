// Comprehensive SEO content database for Toolisiya tools.
// Includes core tools explicitly, and a fallback generator for others to prevent crashes.
import { toolPageData } from './toolPageData.js';

export const toolSeoContent = {
  'gst-calculator': {
    definition: "A Goods and Services Tax (GST) Calculator is an essential financial utility that determines the exact tax amount to be added to or subtracted from a product's base price. It simplifies complex Indian tax slabs (5%, 12%, 18%, 28%) into instant, actionable figures.",
    formulaTypes: "There are two primary calculation types: \n\n1. **Exclusive GST**: Tax Amount = (Base Price × GST Rate) / 100. Final Price = Base Price + Tax Amount.\n2. **Inclusive GST**: Base Price = Final Price - [Final Price × (100 / (100 + GST Rate))]. Tax Amount = Final Price - Base Price.",
    howItWorks: [
      { title: "Select Calculation Mode", description: "Choose whether you want to add GST to a base price (Exclusive) or extract the GST amount from a final price (Inclusive)." },
      { title: "Enter the Amount", description: "Input the monetary value you wish to calculate. Ensure it is the correct base or final figure depending on your mode." },
      { title: "Choose the GST Slab", description: "Select the applicable tax rate (0.25%, 3%, 5%, 12%, 18%, or 28%) based on the HSN/SAC code of your goods or services." },
      { title: "Review the Breakdown", description: "The tool instantly calculates the Total Tax, CGST (Central GST), SGST (State GST), and the Final Net Amount." }
    ],
    tips: [
      "Always verify the current GST slab for your specific product category, as government rates change periodically.",
      "For intra-state transactions, the total GST is split equally between CGST and SGST.",
      "For inter-state transactions, the entire tax amount is applied as IGST.",
      "Keep a record of your calculations if you are issuing manual invoices to ensure total alignment during tax filing.",
      "Use the 'Inclusive' mode when a customer asks for a flat rate and you need to reverse-calculate the tax to report on your invoice."
    ],
    useCases: [
      { title: "Retail Billing", description: "Quickly determining the final sticker price for consumer goods." },
      { title: "Invoice Generation", description: "Accurately separating tax components for B2B tax invoices to allow clients to claim ITC." },
      { title: "Budget Planning", description: "Estimating total project costs including mandatory government taxes before signing contracts." },
      { title: "Reverse Auditing", description: "Checking vendor bills to ensure they haven't overcharged on the tax component." }
    ],
    faq: [
      { question: "What is the difference between CGST, SGST, and IGST?", answer: "CGST goes to the Central Government, SGST goes to the State Government (used for sales within the same state). IGST is an Integrated tax used for sales across state borders." },
      { question: "How do I calculate GST manually?", answer: "To add 18% GST to ₹100, multiply 100 by 0.18 to get ₹18. The total is ₹118." },
      { question: "Can I use this for non-Indian GST?", answer: "Yes! While optimized for Indian tax slabs, you can use the custom percentage feature to calculate VAT or GST for countries like Australia, Canada, or the UK." },
      { question: "Does adding GST affect my profit margin?", answer: "No. GST is an indirect tax paid by the end consumer. As a registered business, you collect it and pass it to the government. It should not eat into your base profit margin if calculated correctly." },
      { question: "What is GST Inclusive pricing?", answer: "Inclusive pricing means the tax is already baked into the final price. For example, a ₹1,000 product with 18% inclusive GST means the actual product cost is ~₹847.45 and the tax is ~₹152.55." }
    ]
  },
  'json-formatter': {
    definition: "A JSON (JavaScript Object Notation) Formatter is a developer utility designed to parse, validate, and beautify raw JSON data strings. It transforms unreadable, minified JSON payloads into structured, human-readable trees with proper indentation and syntax highlighting.",
    formulaTypes: "JSON relies on two primary structural types:\n\n1. **Objects**: Collections of key/value pairs wrapped in curly braces `{}`.\n2. **Arrays**: Ordered lists of values wrapped in square brackets `[]`.",
    howItWorks: [
      { title: "Input Raw Data", description: "Paste your unformatted or minified JSON string directly into the editor. This data often comes from API responses or database logs." },
      { title: "Validation Check", description: "The engine parses the string to ensure it follows strict JSON rules (e.g., double quotes for keys, no trailing commas)." },
      { title: "Beautification", description: "If valid, the tool applies consistent indentation (spaces or tabs) and line breaks to reveal the hierarchical structure of the data." },
      { title: "Syntax Highlighting", description: "Keys, string values, booleans, and numbers are color-coded to make scanning massive data payloads visually intuitive." }
    ],
    tips: [
      "Always use double quotes (\") for both keys and string values. Single quotes (') are invalid in strict JSON.",
      "Remove trailing commas at the end of objects or arrays; they are a common cause of 'Unexpected token' parsing errors.",
      "Use the 'Minify' function before deploying JSON configuration files to production to save bandwidth.",
      "When debugging an API, format the request payload first to ensure you aren't sending malformed data to the server."
    ],
    useCases: [
      { title: "API Debugging", description: "Making sense of massive, single-line JSON responses from REST or GraphQL endpoints." },
      { title: "Configuration Files", description: "Formatting package.json or environment config files for better team readability." },
      { title: "Data Migration", description: "Validating NoSQL database exports (like MongoDB) before importing them into a new environment." },
      { title: "Learning & Education", description: "Helping junior developers visually understand the difference between nested arrays and objects." }
    ],
    faq: [
      { question: "Why is my JSON showing as invalid?", answer: "Common reasons include missing quotation marks around keys, using single quotes instead of double quotes, trailing commas, or unescaped special characters inside strings." },
      { question: "What is the difference between JSON and a JavaScript Object?", answer: "JSON is a strict text format used for data transfer. A JavaScript object is an in-memory data structure. JSON keys must be quoted; JS object keys do not have to be." },
      { question: "Is my data sent to a server?", answer: "No. This tool processes all formatting and validation locally in your browser using JavaScript. Your sensitive payloads remain completely private." },
      { question: "Can I convert XML to JSON here?", answer: "This specific tool formats existing JSON. To convert between formats, please use our dedicated XML to JSON converter tool." }
    ]
  },
  'invoice-generator': {
    definition: "An Invoice Generator is a business utility that allows freelancers, contractors, and companies to instantly create professional, legally compliant billing documents. It automates the calculation of subtotals, taxes, and totals while applying clean typographic formatting.",
    formulaTypes: "Invoices generally involve standard billing arithmetic:\n\n**Line Item Total** = Quantity × Unit Price\n**Subtotal** = Sum of all Line Item Totals\n**Final Total** = Subtotal + Taxes - Discounts.",
    howItWorks: [
      { title: "Enter Business Details", description: "Add your company name, logo, address, and tax registration number (like a GSTIN)." },
      { title: "Add Client Information", description: "Input the recipient's details. If billing B2B, ensure their tax ID is included so they can claim input credit." },
      { title: "List Products/Services", description: "Add individual line items with descriptions, quantities, and rates. The tool calculates the line totals automatically." },
      { title: "Apply Taxes & Download", description: "Add applicable discounts or regional taxes. Review the live preview and download the finished document as a high-resolution PDF." }
    ],
    tips: [
      "Always use a sequential, unique invoice number (e.g., INV-2026-001) for accounting compliance.",
      "Clearly state your payment terms (e.g., 'Net 30', 'Due on Receipt') to avoid delayed payments.",
      "Include your bank account details or a UPI payment link directly on the invoice to make paying you as frictionless as possible.",
      "Send invoices as non-editable PDFs, never as Word documents, to prevent tampering."
    ],
    useCases: [
      { title: "Freelance Billing", description: "Independent designers, writers, and developers requesting payment for completed project milestones." },
      { title: "Small Business Sales", description: "Agencies sending formal tax invoices for B2B services rendered." },
      { title: "E-commerce Wholesale", description: "Generating bulk order invoices that require specific HSN codes and interstate tax splits." },
      { title: "Consulting Retainers", description: "Generating recurring monthly bills for ongoing advisory services." }
    ],
    faq: [
      { question: "Is this invoice format legally valid?", answer: "Yes, our templates include all standard fields required for commercial invoices globally. If you add your GSTIN and exact tax splits, it acts as a compliant tax invoice in India." },
      { question: "Can I add my own logo?", answer: "Absolutely. You can upload your company logo, which will be professionally formatted at the top of the generated PDF document." },
      { question: "What happens if I make a mistake on an issued invoice?", answer: "Once an invoice is sent and entered into accounting, you generally should not edit it. Instead, issue a 'Credit Note' to cancel it, and generate a new corrected invoice." },
      { question: "Do I need to physically sign the invoice?", answer: "For digital invoices, a physical signature is often not required. A line stating 'This is a computer-generated document and requires no physical signature' is widely accepted." }
    ]
  }
};

/**
 * Fallback generator for tools that don't have explicit SEO content defined yet.
 * Ensures the SEOContentDisplay component never crashes and always provides some SEO value.
 */
export const getToolSeoContent = (toolId) => {
  if (!toolId) {
    return null;
  }

  if (toolSeoContent[toolId]) {
    return toolSeoContent[toolId];
  }

  // Check if the tool has data in toolPageData
  const pageData = toolPageData[toolId];
  if (pageData) {
    const formattedName = pageData.toolName || toolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      definition: pageData.whatToolDoes || pageData.toolDescription || `Use our free online ${formattedName} to easily process your tasks.`,
      formulaTypes: pageData.howItWorks && pageData.howItWorks.length > 20 ? pageData.howItWorks : "",
      howItWorks: (pageData.howToUseSteps || []).length > 0
        ? pageData.howToUseSteps.map((step, idx) => ({
            title: `Step ${idx + 1}`,
            description: step
          }))
        : [
            { title: "Input Your Data", description: `Start by entering your required parameters, uploading your file, or pasting your text into the ${formattedName} interface.` },
            { title: "Configure Settings", description: "Adjust any available options, dropdowns, or sliders to tailor the output precisely to your specific requirements." },
            { title: "Process & Generate", description: "Click the primary action button. The tool instantly processes your input using optimized algorithms." },
            { title: "Export Results", description: "Review the generated output. You can immediately copy the results to your clipboard or download the final file to your device." }
          ],
      tips: (pageData.whyUseful || []).length > 0 ? pageData.whyUseful : [
        "Always double-check your initial inputs before processing to ensure maximum accuracy.",
        "Explore the advanced settings or toggle options to unlock the full potential of the tool.",
        "Bookmark this page (Ctrl+D / Cmd+D) for quick access during your daily workflow.",
        "Remember that all processing happens locally in your browser, ensuring your sensitive data remains entirely private."
      ],
      useCases: (pageData.useCases || []).length > 0
        ? pageData.useCases.map((uc, idx) => {
            if (typeof uc === 'string') {
              return { title: `Use Case ${idx + 1}`, description: uc };
            }
            return uc;
          })
        : [
            { title: "Professional Workflows", description: `Integrating the ${formattedName} into daily office tasks to save time and reduce manual errors.` },
            { title: "Academic Research", description: "Students and researchers utilizing the tool to verify calculations or format data for assignments." },
            { title: "Personal Projects", description: "Simplifying everyday digital tasks without needing to install heavy, expensive software." }
          ],
      faq: (pageData.faqs || []).length > 0
        ? pageData.faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer
          }))
        : [
            { question: `Is the ${formattedName} free to use?`, answer: "Yes, this tool is 100% free to use with no hidden fees, subscriptions, or intrusive watermarks." },
            { question: "Do I need to download any software?", answer: "No installation is required. The tool runs entirely within your modern web browser (Chrome, Firefox, Safari, Edge)." },
            { question: "Is my data secure?", answer: "Absolutely. We prioritize your privacy. The vast majority of our tools process data locally on your device, meaning your sensitive information is never uploaded to our servers." },
            { question: "Does it work on mobile devices?", answer: "Yes, the interface is fully responsive and optimized to work flawlessly on smartphones and tablets." }
          ]
    };
  }

  // Generate generic but structured fallback content based on the tool ID
  const formattedName = toolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    definition: `The ${formattedName} is a specialized digital utility designed to simplify complex workflows, automate calculations, and improve overall productivity. Whether you are a professional, student, or hobbyist, this tool provides precise, fast, and secure results directly in your web browser.`,
    formulaTypes: `This tool utilizes industry-standard algorithms and processing techniques to ensure 100% accuracy. All computations and data transformations are executed locally to guarantee speed and privacy.`,
    howItWorks: [
      { title: "Input Your Data", description: `Start by entering your required parameters, uploading your file, or pasting your text into the ${formattedName} interface.` },
      { title: "Configure Settings", description: "Adjust any available options, dropdowns, or sliders to tailor the output precisely to your specific requirements." },
      { title: "Process & Generate", description: "Click the primary action button. The tool instantly processes your input using optimized algorithms." },
      { title: "Export Results", description: "Review the generated output. You can immediately copy the results to your clipboard or download the final file to your device." }
    ],
    tips: [
      "Always double-check your initial inputs before processing to ensure maximum accuracy.",
      "Explore the advanced settings or toggle options to unlock the full potential of the tool.",
      "Bookmark this page (Ctrl+D / Cmd+D) for quick access during your daily workflow.",
      "Remember that all processing happens locally in your browser, ensuring your sensitive data remains entirely private."
    ],
    useCases: [
      { title: "Professional Workflows", description: `Integrating the ${formattedName} into daily office tasks to save time and reduce manual errors.` },
      { title: "Academic Research", description: "Students and researchers utilizing the tool to verify calculations or format data for assignments." },
      { title: "Personal Projects", description: "Simplifying everyday digital tasks without needing to install heavy, expensive software." }
    ],
    faq: [
      { question: `Is the ${formattedName} free to use?`, answer: "Yes, this tool is 100% free to use with no hidden fees, subscriptions, or intrusive watermarks." },
      { question: "Do I need to download any software?", answer: "No installation is required. The tool runs entirely within your modern web browser (Chrome, Firefox, Safari, Edge)." },
      { question: "Is my data secure?", answer: "Absolutely. We prioritize your privacy. The vast majority of our tools process data locally on your device, meaning your sensitive information is never uploaded to our servers." },
      { question: "Does it work on mobile devices?", answer: "Yes, the interface is fully responsive and optimized to work flawlessly on smartphones and tablets." }
    ]
  };
};