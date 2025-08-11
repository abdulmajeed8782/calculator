// This script runs in a Node.js environment, not in the browser.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// --- Configuration ---
// The directory where your individual calculator HTML files are stored.
const toolsDir = path.join(__dirname, 'tools'); 
// The path where the final JSON manifest file will be saved.
const manifestPath = path.join(__dirname, 'calculators.json');
// --- End Configuration ---


/**
 * Reads all .html files from the tools directory, extracts metadata,
 * and generates a JSON manifest file.
 */
function generateManifest() {
    console.log(`Scanning for calculators in: ${toolsDir}`);

    // Ensure the tools directory exists to avoid errors.
    if (!fs.existsSync(toolsDir)) {
        console.error(`Error: The directory '${toolsDir}' does not exist. Please create it and add your calculator files.`);
        // Create an empty manifest to prevent build failures.
        fs.writeFileSync(manifestPath, JSON.stringify([], null, 2));
        return;
    }

    // Read all files in the directory and filter for .html files only.
    const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.html'));

    if (files.length === 0) {
        console.warn('Warning: No HTML calculator files found in the "tools" directory.');
    }

    const calculatorList = files.map(fileName => {
        const filePath = path.join(toolsDir, fileName);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(htmlContent);
        const doc = dom.window.document;

        // Extract metadata from <meta> tags. Fallback to default values if not found.
        const name = doc.querySelector('meta[name="calculator-name"]')?.content || 'Unnamed Calculator';
        const description = doc.querySelector('meta[name="calculator-description"]')?.content || 'No description available.';
        const category = doc.querySelector('meta[name="calculator-category"]')?.content || 'general';

        return { name, description, category, fileName };
    });

    // Write the extracted data to the manifest file with pretty formatting.
    fs.writeFileSync(manifestPath, JSON.stringify(calculatorList, null, 2));

    console.log(`✅ Successfully generated calculators.json with ${calculatorList.length} calculators.`);
}

// Run the function.
generateManifest();
