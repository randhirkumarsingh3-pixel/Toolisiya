import { PDF_CONFIG } from './pdfConfig.js';
import { formatCurrencyForPDF, formatDateForPDF } from './pdfHelpers.js';

export const resumeTemplate = (data) => {
  const { name, email, phone, address, summary, experience = [], education = [], skills = [], photo } = data;
  
  return `
    <div style="font-family: ${PDF_CONFIG.FONT_FAMILY}; color: ${PDF_CONFIG.COLORS.text}; line-height: ${PDF_CONFIG.LINE_HEIGHT}; padding: 20px; max-width: 800px; margin: 0 auto;">
      <header style="border-bottom: 2px solid ${PDF_CONFIG.COLORS.primary}; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0 0 10px 0; font-size: 32px; color: ${PDF_CONFIG.COLORS.text};">${name || 'Your Name'}</h1>
          <div style="color: ${PDF_CONFIG.COLORS.lightText}; font-size: 14px; display: flex; gap: 15px; flex-wrap: wrap;">
            ${email ? `<span>✉ ${email}</span>` : ''}
            ${phone ? `<span>📱 ${phone}</span>` : ''}
            ${address ? `<span>📍 ${address}</span>` : ''}
          </div>
        </div>
        ${photo ? `
          <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 2px solid ${PDF_CONFIG.COLORS.border}; flex-shrink: 0;">
            <img src="${photo}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        ` : ''}
      </header>

      ${summary ? `
      <section style="margin-bottom: 25px;" class="avoid-break">
        <h2 style="color: ${PDF_CONFIG.COLORS.primary}; font-size: 18px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Professional Summary</h2>
        <p style="margin: 0; font-size: 14px;">${summary}</p>
      </section>
      ` : ''}

      ${experience && experience.length > 0 ? `
      <section style="margin-bottom: 25px;">
        <h2 style="color: ${PDF_CONFIG.COLORS.primary}; font-size: 18px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Experience</h2>
        ${experience.map(exp => `
          <div style="margin-bottom: 15px;" class="avoid-break">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
              <h3 style="margin: 0; font-size: 16px; color: ${PDF_CONFIG.COLORS.text};">${exp.title || 'Job Title'}</h3>
              <span style="font-size: 14px; color: ${PDF_CONFIG.COLORS.lightText};">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</span>
            </div>
            <div style="font-size: 14px; font-weight: bold; color: ${PDF_CONFIG.COLORS.text}; margin-bottom: 8px;">${exp.company || 'Company Name'}</div>
            <p style="margin: 0; font-size: 14px; color: ${PDF_CONFIG.COLORS.lightText}; white-space: pre-wrap;">${exp.description || ''}</p>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${education && education.length > 0 ? `
      <section style="margin-bottom: 25px;">
        <h2 style="color: ${PDF_CONFIG.COLORS.primary}; font-size: 18px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Education</h2>
        ${education.map(edu => `
          <div style="margin-bottom: 15px;" class="avoid-break">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
              <h3 style="margin: 0; font-size: 16px; color: ${PDF_CONFIG.COLORS.text};">${edu.degree || 'Degree'}</h3>
              <span style="font-size: 14px; color: ${PDF_CONFIG.COLORS.lightText};">${edu.startYear || ''} - ${edu.endYear || ''}</span>
            </div>
            <div style="font-size: 14px; color: ${PDF_CONFIG.COLORS.text};">${edu.institution || 'Institution'} ${edu.score ? `• ${edu.score}` : ''}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${skills && skills.length > 0 ? `
      <section class="avoid-break">
        <h2 style="color: ${PDF_CONFIG.COLORS.primary}; font-size: 18px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Skills</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${skills.map(skill => `
            <span style="background-color: #F3F4F6; padding: 4px 12px; border-radius: 4px; font-size: 13px; color: ${PDF_CONFIG.COLORS.text}; border: 1px solid ${PDF_CONFIG.COLORS.border};">${skill.name || skill}</span>
          `).join('')}
        </div>
      </section>
      ` : ''}
    </div>
  `;
};

export const invoiceTemplate = (data) => {
  const { invoiceNumber, serviceProviderName, serviceProviderAddress, clientName, items = [], subtotal = 0, gstAmount = 0, totalAmount = 0, date = new Date() } = data;

  return `
    <div style="font-family: ${PDF_CONFIG.FONT_FAMILY}; color: ${PDF_CONFIG.COLORS.text}; line-height: ${PDF_CONFIG.LINE_HEIGHT}; padding: 20px; max-width: 800px; margin: 0 auto;">
      <header style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid ${PDF_CONFIG.COLORS.border}; padding-bottom: 20px;">
        <div>
          <h1 style="margin: 0 0 5px 0; font-size: 36px; color: ${PDF_CONFIG.COLORS.primary}; letter-spacing: -1px;">INVOICE</h1>
          <div style="color: ${PDF_CONFIG.COLORS.lightText}; font-size: 14px;">#${invoiceNumber || 'INV-0000'}</div>
        </div>
        <div style="text-align: right; font-size: 14px;">
          <div style="font-weight: bold; margin-bottom: 5px;">Date: ${formatDateForPDF(date)}</div>
        </div>
      </header>

      <section style="margin-bottom: 40px; display: flex; justify-content: space-between;">
        <div style="width: 45%;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: ${PDF_CONFIG.COLORS.lightText}; text-transform: uppercase;">Service Provider:</h3>
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${serviceProviderName || 'Your Company Name'}</div>
          <div style="color: ${PDF_CONFIG.COLORS.text}; font-size: 14px; white-space: pre-wrap;">${serviceProviderAddress || 'Your Address'}</div>
        </div>
        <div style="width: 45%; text-align: right;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: ${PDF_CONFIG.COLORS.lightText}; text-transform: uppercase;">Bill To:</h3>
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${clientName || 'Client Name'}</div>
        </div>
      </section>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
        <thead>
          <tr style="background-color: #F9FAFB; border-bottom: 2px solid ${PDF_CONFIG.COLORS.border};">
            <th style="padding: 12px; text-align: left; color: ${PDF_CONFIG.COLORS.lightText}; font-weight: 600;">Description</th>
            <th style="padding: 12px; text-align: center; color: ${PDF_CONFIG.COLORS.lightText}; font-weight: 600;">Qty</th>
            <th style="padding: 12px; text-align: right; color: ${PDF_CONFIG.COLORS.lightText}; font-weight: 600;">Rate</th>
            <th style="padding: 12px; text-align: right; color: ${PDF_CONFIG.COLORS.lightText}; font-weight: 600;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr style="border-bottom: 1px solid ${PDF_CONFIG.COLORS.border};">
              <td style="padding: 12px; text-align: left;">${item.description || 'Item Description'}</td>
              <td style="padding: 12px; text-align: center;">${item.quantity || 0}</td>
              <td style="padding: 12px; text-align: right;">${formatCurrencyForPDF(item.rate || 0)}</td>
              <td style="padding: 12px; text-align: right; font-weight: 500;">${formatCurrencyForPDF((item.quantity || 0) * (item.rate || 0))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;" class="avoid-break">
        <div style="width: 300px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
            <span style="color: ${PDF_CONFIG.COLORS.lightText};">Subtotal</span>
            <span>${formatCurrencyForPDF(subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid ${PDF_CONFIG.COLORS.border};">
            <span style="color: ${PDF_CONFIG.COLORS.lightText};">GST</span>
            <span>${formatCurrencyForPDF(gstAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: bold; color: ${PDF_CONFIG.COLORS.primary};">
            <span>Total</span>
            <span>${formatCurrencyForPDF(totalAmount)}</span>
          </div>
        </div>
      </div>

      <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid ${PDF_CONFIG.COLORS.border}; font-size: 12px; color: ${PDF_CONFIG.COLORS.lightText}; text-align: center;" class="avoid-break">
        <p style="margin: 0 0 5px 0; font-weight: bold; color: ${PDF_CONFIG.COLORS.text};">Thank you for your business!</p>
      </footer>
    </div>
  `;
};