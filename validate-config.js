const fs = require('fs');
const path = require('path');

function main() {
  const vercelPath = path.join(__dirname, 'vercel.json');
  const v = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const allowed = ['$schema','buildCommand','cleanUrls','command','create','crons','devCommand','framework','functions','headers','ignoreCommand','installCommand','outputDirectory','regions','redirects','rewrites','trailingSlash','images','public','cache','git','github','gitlab','bitbucket','autoAlias','autoAssignCustomDomains','concurrentBuilds','name','environment','teamId','projectId'];
  const bad = Object.keys(v).filter(k => !allowed.includes(k));
  console.log('vercel.json keys: ' + Object.keys(v).join(', '));
  if (bad.length) { console.error('INVALID KEYS: ' + bad.join(', ')); process.exit(1); }
  else console.log('✅ vercel.json schema keys all valid');

  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log('package.json engines.node: ' + (pkg.engines && pkg.engines.node));

  const nvPath = path.join(__dirname, '.node-version');
  const nvmrcPath = path.join(__dirname, '.nvmrc');
  console.log('.node-version: ' + (fs.existsSync(nvPath) ? fs.readFileSync(nvPath,'utf8').trim() : '(missing)'));
  console.log('.nvmrc:        ' + (fs.existsSync(nvmrcPath) ? fs.readFileSync(nvmrcPath,'utf8').trim() : '(missing)'));
}
main();
