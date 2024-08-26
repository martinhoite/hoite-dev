// This file is for generating a full stylesheet with all possible itterations of the section grid.
// I'm currently not planning on using it, but thought it was interesting enough to leave as a possiblity in the future.
// Usage: writing
// node generate-section-grid-classes.cjs
// will generate the css file in the assets/css folder - see outputPath further down.

const fs = require('fs');
const path = require('path');

const breakpoints = {
  mobile: null, // No media query for mobile as mobile first
  tablet: '576px',
  laptop: '1024px',
  'small-desktop': '1280px',
  desktop: '1536px'
};
const maxColumns = {
  mobile: 4,
  tablet: 8,
  laptop: 12,
  'small-desktop': 12,
  desktop: 12
};

let css = '';

const generateGridClasses = (bp, max, breakpointValue) => {
  if (breakpointValue) {
    css += `@media (min-width: ${breakpointValue}) {\n`;
  }

  for (let start = 1; start <= max; start++) {
    for (let end = start + 1; end <= max + 1; end++) {
      // Named start column
      if (start == 1) {
        css += `  .${bp}-col-span--${start}-${end},\n`;
        css += `  .${bp}-col-span--start-${end} {\n`;
        css += `    grid-column: ${bp}-start-column / ${end} ;\n`;
        css += `  }\n\n`;
      }

      // Numeric end values
      if (end <= max) {
        css += `  .${bp}-col-span--${start}-${end} {\n`;
        css += `    grid-column: ${start} / ${end};\n`;
        css += `  }\n\n`;
      }

      // Named end column
      if (end > max) {
        css += `  .${bp}-col-span--${start}-${max + 1},\n`;
        css += `  .${bp}-col-span--${start}-end, \n`;
        css += `  .${bp}-col-span--${start}-full {\n`;
        css += `    grid-column: ${start} / ${bp}-end-column;\n`;
        css += `  }\n\n`;
      }
    }
  }

  if (breakpointValue) {
    css += `}\n\n`;
  }
};

for (const [bp, breakpointValue] of Object.entries(breakpoints)) {
  generateGridClasses(bp, maxColumns[bp], breakpointValue);
}

const outputPath = path.resolve(__dirname, 'assets', 'css', 'generated-grid-classes.css');

const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, css);

console.log('CSS file generated:', outputPath);
