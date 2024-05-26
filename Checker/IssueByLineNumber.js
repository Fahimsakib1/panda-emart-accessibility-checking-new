const fs = require('fs');
const cheerio = require('cheerio');

// Read HTML content from file
const htmlContent = fs.readFileSync('../mainTestScriptFile.html', 'utf8');
const $ = cheerio.load(htmlContent);

// Function to get line numbers for each button element
function getElementLineNumbers(htmlContent, elementTag) {
    const regex = new RegExp(`<${elementTag}(\\s+[\\w-]+(\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+))?)*\\s*>`, 'gi');
    const lineNumbers = [];
    let match;

    while ((match = regex.exec(htmlContent)) !== null) {
        const lineNumber = htmlContent.substring(0, match.index).split('\n').length;
        const elementTag = match[0];
        lineNumbers.push({ tag: elementTag, lineNumber });
    }

    return lineNumbers;
}

// Get line numbers for button elements
const buttonLineNumbers = getElementLineNumbers(htmlContent, 'button');
console.log("buttonLineNumbers", buttonLineNumbers);



