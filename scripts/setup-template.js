#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');


// Files to process
const filesToProcess = [
  'package.json',
  'README.md'
];

// Template files to process (generate new files from templates)
const templateFiles = [
  {
    template: 'manifest.template.json',
    output: 'manifest.json'
  }
];

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Replace template variables in files
function replaceTemplateVars(content, replacements) {
  let result = content;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  return result;
}

// Main function
async function main() {
  console.log('🚀 ONES App NestJS Template Setup');
  console.log('=====================================\n');

  let randomUUID = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  // Collect user input
  const appId = await askQuestion(`Entee app ID (random_result: app_${randomUUID}): `) || `app_${randomUUID}`;
  const appName = await askQuestion('Enter app name: ');
  const appDescription = await askQuestion('Enter app description: ');
  const appVersion = await askQuestion('Enter app version (default: v0.0.1): ') || 'v0.0.1';

  // Create replacement mapping
  const replacements = {
    '{{APP_ID}}': appId,
    '{{APP_NAME}}': appName,
    '{{APP_DESCRIPTION}}': appDescription,
    '{{APP_VERSION}}': appVersion
  };

  console.log('\n📝 Updating files...');

  // Process each file
  for (const file of filesToProcess) {
    try {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = replaceTemplateVars(content, replacements);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Failed to update file ${file}:`, error.message);
    }
  }

  // Process template files (generate new files from templates)
  for (const templateFile of templateFiles) {
    try {
      const templatePath = path.join(process.cwd(), templateFile.template);
      const outputPath = path.join(process.cwd(), templateFile.output);
      
      if (fs.existsSync(templatePath)) {
        let content = fs.readFileSync(templatePath, 'utf8');
        content = replaceTemplateVars(content, replacements);
        fs.writeFileSync(outputPath, content, 'utf8');
        console.log(`✅ Generated: ${templateFile.output} from ${templateFile.template}`);
      } else {
        console.error(`❌ Template file not found: ${templateFile.template}`);
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${templateFile.output}:`, error.message);
    }
  }

  // Create .env file
  try {
    const envContent = `# ONES App Configuration
APP_ID=${appId}
APP_NAME=${appName}
APP_DESCRIPTION=${appDescription}
APP_VERSION=${appVersion}

# ONES Server Configuration
ONES_SERVER_URL=https://your-ones-server.com
RELAY_TOKEN=your_relay_token

# Database Configuration (Optional)
DATABASE_TYPE=sqlite
DATABASE_PATH=./app.db

# Server Configuration
PORT=3000
NODE_ENV=development
`;
    fs.writeFileSync(path.join(process.cwd(), '.env'), envContent, 'utf8');
    console.log('✅ Created: .env');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }

  console.log('\n🎉 Template setup completed!');
  console.log('\nNext steps:');
  console.log('1. Run npm install to install dependencies');
  console.log('2. Run cd web && npm install to install frontend dependencies');
  console.log('3. Run npm run start:dev to start development server');

  rl.close();
}

// Run main function
main().catch(console.error);
