import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file; process.env takes precedence over .env values
const envVars = {};
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^(["'])(.*)\1$/, '$2');
    envVars[key] = process.env[key] ?? val;
  }
}

// Read wrangler.jsonc
const wranglerPath = path.join(__dirname, '..', 'wrangler.jsonc');
let wranglerContent = fs.readFileSync(wranglerPath, 'utf-8');

// Replace each KEY with its env value where found in the content
for (const [key, value] of Object.entries(envVars)) {
  wranglerContent = wranglerContent.replaceAll(key, value);
}

// Write the updated content back
fs.writeFileSync(wranglerPath, wranglerContent, 'utf-8');
console.log('wrangler.jsonc updated with environment variables');
