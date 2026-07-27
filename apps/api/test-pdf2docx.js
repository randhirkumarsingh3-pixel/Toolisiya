import fs from 'fs';
import { Pdf2Docx } from 'pdf2docx-wasm';

async function test() {
  try {
    console.log('Loading PDF...');
    const pdfBytes = fs.readFileSync('test.pdf');
    console.log('Instantiating...');
    const converter = new Pdf2Docx();
    console.log('Loading WASM module...');
    await converter.load();
    console.log('Converting...');
    const docxBytes = await converter.convert(pdfBytes);
    fs.writeFileSync('test.docx', docxBytes);
    console.log('Conversion successful!');
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
