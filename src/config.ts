import fs from 'fs'

type CONFIG = {
    namespace: string
    outdir: string
    mcmeta: {
        pack: {
            description?: string
            pack_format: number
        }
    }
}

// 讀取並解析 JSON 檔案
const data = JSON.parse(fs.readFileSync('./mcfn.json', 'utf-8'))
export const config: CONFIG = data
