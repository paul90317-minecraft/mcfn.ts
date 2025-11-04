import fs from 'fs'

type CONFIG = {
    namespace: string
    datapack: {
        mcmeta: {
            pack: {
                description?: string
                pack_format: number,
            }
        },
        icon?: string
        outdir: string
    },
    resourcepack: {
        mcmeta: {
            pack: {
                description?: string
                pack_format: number,
            }
        },
        icon?: string
        outdir: string
    }
}

// 讀取並解析 JSON 檔案
const data = JSON.parse(fs.readFileSync('./mcfn.json', 'utf-8'))
export const config: CONFIG = data
