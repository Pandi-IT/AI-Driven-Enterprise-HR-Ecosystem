const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const env = {};

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value;
    }
  });
}

const apiUrl = process.env.API_URL || env.API_URL || 'http://localhost:8081/api';
const production = process.env.PRODUCTION === 'true' || env.PRODUCTION === 'true' || false;

const envConfigFile = `// This file is generated dynamically by set-env.js
export const environment = {
  production: ${production},
  apiUrl: '${apiUrl}'
};
`;

const envConfigFileProd = `// This file is generated dynamically by set-env.js
export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || env.API_URL || '/api'}'
};
`;

const dir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'environment.ts'), envConfigFile);
fs.writeFileSync(path.join(dir, 'environment.prod.ts'), envConfigFileProd);

console.log('Environments generated successfully!');
