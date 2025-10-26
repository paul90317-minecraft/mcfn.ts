import * as fs from 'fs';
import axios from 'axios';
import AdmZip from 'adm-zip';

async function downloadFile(url: string, outputPath: string): Promise<void> {
  const writer = fs.createWriteStream(outputPath);

  const response = await axios.get(url, {
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    let error: Error | null = null;
    writer.on('error', err => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) {
        resolve();
      }
    });
  });
}

function unzipFile(zipPath: string, extractTo: string) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(extractTo, /* overwrite = */ true);
}

function transformFile(jsonPath: string, TSPath: string, name: string) {
  let data = fs.readFileSync(jsonPath, {
    encoding: 'utf8'
  })
  let jsonData = JSON.parse(data)
  let tags = Object.keys(jsonData).map(t=>`'${t}'`)
  let dataToWrite = `export type ${name} = ${tags.join(' | ')};\n`
  fs.writeFileSync(TSPath, dataToWrite)
}

async function main() {
  try {
    const url = 'https://github.com/misode/mcmeta/archive/refs/heads/summary.zip';
    const downloadPath = './mcmeta.zip'
    const extractDir = './'
    console.log('Downloading ZIP from', url);
    await downloadFile(url, downloadPath);
    console.log('Download completed:', downloadPath);

    console.log('Extracting to', extractDir);
    unzipFile(downloadPath, extractDir);
    console.log('Extraction completed.');

    fs.unlinkSync(downloadPath);
    console.log('Cache cleaned.');

    console.log('Generating block.ts')
    transformFile(
      'mcmeta-summary/data/tag/block/data.json',
      'src/enum/tag/block.ts',
      'BLOCK_TAG'
    )
    transformFile(
      'mcmeta-summary/data/tag/item/data.json',
      'src/enum/tag/item.ts',
      'ITEM_TAG'
    )
    transformFile(
      'mcmeta-summary/data/tag/entity_type/data.json',
      'src/enum/tag/entity_type.ts',
      'ENTITY_TYPE_TAG'
    )
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
