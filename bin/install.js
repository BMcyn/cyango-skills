#!/usr/bin/env node
import degit from 'degit';
import path from 'path';
import fs from 'fs';

const REPO = 'joaomelorodrigues/cyango-skills';
const SKILLS_PATH = 'skills'; // subfolder inside the repo

const AVAILABLE_SKILLS = {
  'cyango-mcp': `${REPO}/skills/cyango-mcp`,
};

const [,, command, skillName] = process.argv;

if (command === 'install' && skillName) {
  const source = AVAILABLE_SKILLS[skillName];
  if (!source) {
    console.error(`Unknown skill: "${skillName}"`);
    console.error(`Available: ${Object.keys(AVAILABLE_SKILLS).join(', ')}`);
    process.exit(1);
  }

  const dest = path.join(process.cwd(), '.agents', 'skills', skillName);
  fs.mkdirSync(dest, { recursive: true });

  const emitter = degit(source, { force: true });
  console.log(`Installing ${skillName}...`);
  await emitter.clone(dest);
  console.log(`✓ Installed to ${dest}`);

} else if (command === 'list') {
  console.log('Available skills:');
  Object.keys(AVAILABLE_SKILLS).forEach(s => console.log(`  - ${s}`));

} else {
  console.log('Usage:');
  console.log('  npx @cyango/skills install cyango-mcp');
  console.log('  npx @cyango/skills list');
}