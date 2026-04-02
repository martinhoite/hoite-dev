import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export async function generateDocTypeFiles({ cwd = process.cwd() } = {}) {
  const manifestPath = path.resolve(cwd, 'openapi/doc-types.seed.json');
  const configPath = path.resolve(cwd, 'openapi/public-api.config.json');
  const generatedDir = path.resolve(cwd, 'src/generated');

  const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

  const manifest = await readJson(manifestPath);
  const docTypes = [...new Set(manifest.docTypes)].sort();
  const sourceLabel = 'openapi/doc-types.seed.json';

  if (docTypes.length === 0) {
    throw new Error(`No Umbraco document types were defined in ${manifestPath}.`);
  }

  const config = await readJson(configPath);
  const excludedDocTypes = [...new Set(config.excludedDocTypes)].sort();

  const unknownExcludedDocTypes = excludedDocTypes.filter((docType) => !docTypes.includes(docType));

  if (unknownExcludedDocTypes.length > 0) {
    throw new Error(
      `Excluded document types are not defined in ${manifestPath}: ${unknownExcludedDocTypes.join(', ')}`,
    );
  }

  const publicDocTypes = docTypes.filter((docType) => !excludedDocTypes.includes(docType));

  const formatConstArray = (values) => {
    if (values.length === 0) {
      return '[]';
    }

    if (values.length <= 3) {
      return `[${values.map((value) => `'${value}'`).join(', ')}]`;
    }

    return `[\n${values.map((value) => `  '${value}',`).join('\n')}\n]`;
  };

  const sourceComment = `Generated from ${sourceLabel}.`;

  const allDocTypesFile = `export const allUmbracoDocTypes = ${formatConstArray(docTypes)} as const;\n\nexport type UmbracoDocType = (typeof allUmbracoDocTypes)[number];\n\nexport const umbracoDocTypeSource = '${sourceComment}' as const;\n`;
  const publicDocTypesFile = `export const excludedUmbracoDocTypes = ${formatConstArray(excludedDocTypes)} as const;\n\nexport const publicUmbracoDocTypes = ${formatConstArray(publicDocTypes)} as const;\n\nexport type ExcludedUmbracoDocType = (typeof excludedUmbracoDocTypes)[number];\nexport type PublicUmbracoDocType = (typeof publicUmbracoDocTypes)[number];\n`;

  await mkdir(generatedDir, { recursive: true });
  await writeFile(path.join(generatedDir, 'all-doc-types.generated.ts'), allDocTypesFile, 'utf8');
  await writeFile(
    path.join(generatedDir, 'public-doc-types.generated.ts'),
    publicDocTypesFile,
    'utf8',
  );

  console.log(`Generated Umbraco doc type files from ${sourceLabel}.`);
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  await generateDocTypeFiles();
}
