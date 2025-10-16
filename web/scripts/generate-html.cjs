const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const assetsDir = path.join(distDir, 'assets');

// 获取构建后的资源文件
function getAssetFiles() {
  if (!fs.existsSync(assetsDir)) {
    console.error('Assets directory not found. Please run build first.');
    process.exit(1);
  }
  
  const files = fs.readdirSync(assetsDir);
  const assets = {
    page1: { js: null, css: null },
    page2: { js: null, css: null },
    shared: { js: null, css: null }
  };
  
  files.forEach(file => {
    if (file.includes('page1') && file.endsWith('.js')) {
      assets.page1.js = file;
    } else if (file.includes('page2') && file.endsWith('.js')) {
      assets.page2.js = file;
    } else if (file.includes('index') && file.endsWith('.js')) {
      assets.shared.js = file;
    } else if (file.endsWith('.css')) {
      assets.page1.css = file;
      assets.page2.css = file;
      assets.shared.css = file;
    }
  });
  
  return assets;
}

// 生成 HTML 模板
function generateHTML(pageName, assets) {
  const title = pageName === 'page1' ? 'Page 1 - AppV2' : 'Page 2 - AppV2';
  const jsFile = assets[pageName].js;
  const sharedJsFile = assets.shared.js;
  const cssFile = assets.shared.css;
  
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${cssFile ? `<link rel="stylesheet" crossorigin href="/static/assets/${cssFile}">` : ''}
    ${sharedJsFile ? `<link rel="modulepreload" crossorigin href="/static/assets/${sharedJsFile}">` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="/static/assets/${jsFile}"></script>
  </body>
</html>`;
}

// 主函数
function main() {
  const assets = getAssetFiles();
  
  // 生成 page1.html
  const page1HTML = generateHTML('page1', assets);
  fs.writeFileSync(path.join(distDir, 'page1.html'), page1HTML);
  
  // 生成 page2.html
  const page2HTML = generateHTML('page2', assets);
  fs.writeFileSync(path.join(distDir, 'page2.html'), page2HTML);
  
  console.log('HTML files generated successfully!');
  console.log('Generated files:');
  console.log('- page1.html');
  console.log('- page2.html');
}

main();
