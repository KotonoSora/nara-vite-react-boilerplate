#!/usr/bin/env node

/**
 * Setup script for NARA boilerplate
 * Automatically configures a new project after degit cloning
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 Setting up your new NARA project...\n');

  // Get project details
  const projectName = await question('Project name: ');
  const projectDescription = await question('Project description (optional): ');
  const authorName = await question('Author name: ');
  const gitRepo = await question('Git repository URL (optional): ');

  console.log('\n📦 Configuring project files...');

  // Update package.json
  if (existsSync('package.template.json')) {
    const packageTemplate = JSON.parse(readFileSync('package.template.json', 'utf8'));
    packageTemplate.name = projectName;
    packageTemplate.description = projectDescription || `A modern React app built with NARA boilerplate`;
    packageTemplate.author = authorName;
    
    if (gitRepo) {
      packageTemplate.repository.url = gitRepo;
    } else {
      delete packageTemplate.repository;
    }

    writeFileSync('package.json', JSON.stringify(packageTemplate, null, 2));
    unlinkSync('package.template.json');
    console.log('✅ Updated package.json');
  }

  // Setup README
  if (existsSync('README.template.md')) {
    let readme = readFileSync('README.template.md', 'utf8');
    readme = readme.replace('# Your Project Name', `# ${projectName}`);
    
    if (projectDescription) {
      readme = readme.replace(
        'A modern full-stack React application built with the NARA (Non‑Abstract Reusable App) boilerplate.',
        `${projectDescription}\n\nBuilt with the NARA (Non‑Abstract Reusable App) boilerplate.`
      );
    }

    writeFileSync('README.md', readme);
    unlinkSync('README.template.md');
    console.log('✅ Created README.md');
  }

  console.log('\n🎉 Setup complete! Next steps:');
  console.log('1. npm install (or bun install)');
  console.log('2. Copy .env.example to .env.local and configure');
  console.log('3. npm run db:generate && npm run db:migrate');
  console.log('4. npm run dev');
  console.log('\nHappy coding! 🚀');

  rl.close();
}

setup().catch(console.error);