import fs from 'fs';
import { z } from 'zod';

const PackSchema = z.object({
  description: z.string().optional(),
  pack_format: z.number(),
});

const SectionSchema = z.object({
  mcmeta: z.object({ pack: PackSchema }),
  icon: z.string().optional(),
  outdir: z.string(),
});

const ConfigSchema = z.object({
  namespace: z.string().nonempty(),
  datapack: SectionSchema,
  resourcepack: SectionSchema,
});

var _config
try {
    const raw = JSON.parse(fs.readFileSync('./mcfn.json', 'utf-8'));
    _config = ConfigSchema.parse(raw);
} catch (e) {
    _config = {
        "namespace": "example",
        "datapack": {
            "mcmeta": {
                "pack": {
                    "description": "Example Datapack",
                    "pack_format": 88
                }
            },
            "outdir": "out/datapack",
            "icon": "pack.png"
        },
        "resourcepack": {
            "mcmeta": {
                "pack": {
                    "description": "Example Resource Pack",
                    "pack_format": 69
                }
            },
            "outdir": "out/resourcepack",
            "icon": "pack.png"
        }
    }
    console.log('Configuration not found')
    console.log('Default one is generated')
    fs.writeFileSync('./mcfn.json', JSON.stringify(_config))
}
export const config = _config

console.log('Validated config:', _config);
