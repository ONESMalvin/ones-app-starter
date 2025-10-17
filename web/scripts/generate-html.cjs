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
    'example-page': { js: null, css: null },
    shared: { js: null, css: null }
  };
  
  files.forEach(file => {
    if (file.includes('example-page') && file.endsWith('.js')) {
      assets['example-page'].js = file;
    } else if (file.includes('index') && file.endsWith('.js')) {
      assets.shared.js = file;
    } else if (file.endsWith('.css')) {
      assets['example-page'].css = file;
      assets.shared.css = file;
    }
  });
  
  return assets;
}

// 生成 HTML 模板
function generateHTML(pageName, assets) {
  const title = pageName === 'example-page' ? 'Example Page - AppV2' : 'AppV2';
  const jsFile = assets[pageName].js;
  const sharedJsFile = assets.shared.js;
  const cssFile = assets.shared.css;
  
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${cssFile ? `<link rel="stylesheet" crossorigin href="./assets/${cssFile}">` : ''}
    ${sharedJsFile ? `<link rel="modulepreload" crossorigin href="./assets/${sharedJsFile}">` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="./assets/${jsFile}"></script>
  </body>
</html>`;
}

// 主函数
function main() {
  const assets = getAssetFiles();
  
  // 生成 example-page.html
  const examplePageHTML = generateHTML('example-page', assets);
  fs.writeFileSync(path.join(distDir, 'example-page.html'), examplePageHTML);
  
  console.log('HTML files generated successfully!');
  console.log('Generated files:');
  console.log('- example-page.html');
}

main();
