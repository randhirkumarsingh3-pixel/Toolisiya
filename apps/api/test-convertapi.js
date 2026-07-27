import fs from 'fs';

async function test() {
  try {
    const pdfBuffer = fs.readFileSync('test.pdf');
    console.log('Converting using native fetch...');
    
    const formData = new FormData();
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    formData.append('File', blob, 'test.pdf');
    
    const response = await fetch('https://v2.convertapi.com/convert/pdf/to/docx?Secret=d3Qv58EBMWD9z9eXRndK8eTbP3h6Apep', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    console.log('Result:', data);
    
    if (data.Files && data.Files.length > 0) {
        const fileData = data.Files[0].FileData;
        const outBuffer = Buffer.from(fileData, 'base64');
        fs.writeFileSync('test_out.docx', outBuffer);
        console.log('Saved to test_out.docx');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
