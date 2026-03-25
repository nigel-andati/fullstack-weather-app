/**
 * First-time setup: creates backend/.env and frontend/.env from examples if missing.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const example = path.join(root, '.env.example');
const backendTarget = path.join(root, 'backend', '.env');

if (!fs.existsSync(example)) {
  console.error('Missing .env.example at project root.');
  process.exit(1);
}

if (fs.existsSync(backendTarget)) {
  console.log('backend/.env already exists — skipped (delete it to recreate).');
} else {
  fs.copyFileSync(example, backendTarget);
  console.log('Created backend/.env from .env.example');
  console.log('Next: add OPENWEATHER_API_KEY (and optionally YOUTUBE_API_KEY) to backend/.env');
}

const feExample = path.join(root, 'frontend', '.env.example');
const feTarget = path.join(root, 'frontend', '.env');
if (fs.existsSync(feExample) && !fs.existsSync(feTarget)) {
  fs.copyFileSync(feExample, feTarget);
  console.log('Created frontend/.env from frontend/.env.example');
  console.log('Edit frontend/.env and set VITE_APPLICANT_NAME=Your Name for the submission footer.');
} else if (fs.existsSync(feTarget)) {
  console.log('frontend/.env already exists — skipped.');
}
