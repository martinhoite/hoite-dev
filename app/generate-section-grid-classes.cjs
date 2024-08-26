// This file is for generating a full stylesheet with all possible itterations of the section grid.
// Usage: write the following in the terminal:
// node generate-section-grid-classes.cjs
// will generate the css file in the assets/css folder - see outputPath further down.
const fs = require('fs');
const path = require('path');

const customMediaQueries = {
  mobile: '--mobile-only',
  tablet: '--tablet-only',
  laptop: '--laptop-only',
  'small-desktop': '--small-desktop-only',
  desktop: '--desktop'
};

const maxColumns = {
  mobile: 4,
  tablet: 8,
  laptop: 12,
  'small-desktop': 12,
  desktop: 12
};

let css = '';

const generateGridClasses = (bp, max, mediaQueryName) => {
  if (mediaQueryName) {
    css += `@media (${mediaQueryName}) {\n`;
  }

  for (let start = 1; start <= max; start++) {
    for (let end = start + 1; end <= max + 1; end++) {
      if (start == 1) {
        css += `  .section-grid__${bp}-col-span--${start}-${end},\n`;
        css += `  .section-grid__${bp}-col-span--start-${end} {\n`;
        css += `    > * {\n`;
        css += `      grid-column: ${bp}-grid-start / ${end};\n`;
        css += `    }\n`;
        css += `  }\n\n`;
      }

      if (end <= max) {
        css += `  .section-grid__${bp}-col-span--${start}-${end} {\n`;
        css += `    > * {\n`;
        css += `      grid-column: ${start} / ${end};\n`;
        css += `    }\n`;
        css += `  }\n\n`;
      }

      if (end > max) {
        css += `  .section-grid__${bp}-col-span--${start}-end,\n`;
        if (start == 1) {
          css += `  .section-grid__${bp}-col-span--${start}-${max + 1},\n`;
          css += `  .section-grid__${bp}-col-span--full {\n`;
        } else {
          css += `  .section-grid__${bp}-col-span--${start}-${max + 1} {\n`;
        }
        css += `    > * {\n`;
        css += `      grid-column: ${start} / ${bp}-grid-end;\n`;
        css += `    }\n`;
        css += `  }\n\n`;
      }
    }
  }

  if (mediaQueryName) {
    css += `}\n\n`;
  }
};

// Generate grid classes for each breakpoint
for (const [bp, mediaQueryName] of Object.entries(customMediaQueries)) {
  generateGridClasses(bp, maxColumns[bp], mediaQueryName);
}

const outputPath = path.resolve(__dirname, 'assets', 'css', 'generated-section-grid-classes.css');
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, css);

console.log('CSS file generated:', outputPath);
