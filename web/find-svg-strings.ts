// import fs from 'fs';
// import path from 'path';

// const rootDir = './src'; // Altere aqui para sua pasta base

// const pattern = /data:image\/svg\+xml[^'"\s]*/g;

// function findSvgStringsInFile(filePath: string) {
//   try {
//     const content = fs.readFileSync(filePath, 'utf-8');
//     const matches = content.matchAll(pattern);
//     let found = false;

//     for (const match of matches) {
//       found = true;
//       const lines = content.split('\n');
//       const lineNumber = lines.findIndex((line) => line.includes(match[0])) + 1;

//       console.log(`🔍 Encontrado em: ${filePath}`);
//       console.log(`Linha ${lineNumber}: ${match[0]}\n`);

//       if (lines[lineNumber - 1].includes('<') && !lines[lineNumber - 1].includes('img')) {
//         console.log(`🚨 Pode estar sendo usado como JSX diretamente — isso quebra o React.`);
//         console.log(`➡️ Sugestão: use <img src="..." /> ao invés de <... />\n`);
//       }
//     }
//     return found;
//   } catch (err) {
//     console.error(`Erro lendo arquivo ${filePath}:`, err);
//     return false;
//   }
// }

// function walk(dir: string) {
//   let totalFiles = 0;
//   try {
//     const entries = fs.readdirSync(dir, { withFileTypes: true });

//     for (const entry of entries) {
//       const fullPath = path.join(dir, entry.name);

//       if (entry.isDirectory()) {
//         walk(fullPath);
//       } else if (entry.name.endsWith('.tsx')) {
//         totalFiles++;
//         findSvgStringsInFile(fullPath);
//       }
//     }
//   } catch (err) {
//     console.error(`Erro lendo diretório ${dir}:`, err);
//   }
//   if (dir === rootDir) {
//     console.log(`📁 Escaneados ${totalFiles} arquivos .tsx em ${rootDir}`);
//   }
// }

// console.log('🔎 Iniciando busca por SVGs inline...');
// walk(rootDir);
// console.log('🔚 Busca finalizada.');
