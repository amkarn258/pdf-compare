const fs = require('fs').promises;
const PDFParser = require('pdf-parse');

var lines = 0;
var different_lines = [];

async function getPdfText(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await PDFParser(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to read or validate PDF content from ${filePath}: ${error.message}`);
  }
}

async function comparePDFs(pdf1Path, pdf2Path) {
  try {
    const pdf1Text = await getPdfText(pdf1Path);
    const pdf2Text = await getPdfText(pdf2Path);

    const lines1 = pdf1Text.split('\n');
    const lines2 = pdf2Text.split('\n');

    const maxLength = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 !== line2) {
        lines += 1;
        different_lines.push({ "line_number": i + 1, "text_pdf1": line1, "text_pdf2": line2 });
      }
    }

    if (lines !== 0) {
      console.log(`Files are different: total ${lines} lines are different between the files`);
      console.log(`Different lines: ${JSON.stringify(different_lines, null, 2)}`);
    } else {
      console.log("Files are identical");
    }
  } catch (error) {
    console.error('Error comparing PDFs:', error.message);
  }
}

// Replace with the path of pdf files to compare
const pdfURL1 = "C:/Users/karnz/Downloads/1.pdf"; 
const pdfURL2 = "C:/Users/karnz/Downloads/2.pdf";
comparePDFs(pdfURL1, pdfURL2);