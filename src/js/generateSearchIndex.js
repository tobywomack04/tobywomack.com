const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlDirs = [
  { dir: '.', baseUrl: '/' },                  // Root-level index.html
  { dir: 'src/html', baseUrl: '/src/html/' }   // All other HTML files
];

const outputPath = path.join(__dirname, '..', 'data', 'search-index.json');

function extractTextFromHtml(html) {
  const $ = cheerio.load(html);
  $('script, style, nav, footer').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

function generateIndex() {
  const index = [];

  htmlDirs.forEach(({ dir, baseUrl }) => {
    const dirPath = path.join(__dirname, '..', '..', dir);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const html = fs.readFileSync(filePath, 'utf8');

      const $ = cheerio.load(html);
      const title = $('title').text() || file;
      const content = extractTextFromHtml(html);

      index.push({
        title,
        url: path.posix.join(baseUrl, file),
        content: content
      });
    });
  });

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Search index generated: ${index.length} page(s).`);
}

generateIndex();