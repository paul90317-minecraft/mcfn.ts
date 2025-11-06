# mcfn.ts
This is a TypeScript library for building Minecraft function files, datapack, and resourcepack programmatically. 

## Usage
Here is a simple example of how to use the library to create a Minecraft function file:
```typescript
import { effect, execute, minecraft, objective, sel } from "mcfn.ts";

let kill_count = objective('minecraft.killed:minecraft.zombie')
let death_count = objective('deathCount')
let rage_level = objective('dummy')

minecraft.tick(() => {
    execute.as(sel('@a')).at(sel('@s')).run(() => {
        let self = sel('@s')
        let player_kill_count = kill_count.get(self)
        let player_death_count = death_count.get(self)
        let player_rage_level = rage_level.get(self)
        execute.if(player_death_count.ge(1)).run(() => {
            player_death_count.reset()
            player_rage_level.reset()
        })
        execute.if(player_kill_count.ge(1)).run(() => {
            player_kill_count.reset()
            execute.if(player_rage_level.lt(200)).run(() => {
                player_rage_level.addby(1)
            }, true)
        })
        for (let i = 1; i <= 200; i++) {
            execute.if(player_rage_level.eq(i)).run(() => {
                effect.give(self, 'strength', 1, i - 1)
            }, true)
        }
        
    })
})
```
This code is "Minecraft, but killing zombies makes you stronger, until you die". The generated datapack contains five function files for /execute forking, and 200 more lines in the function that gives player strength effect based on rage levels. All of these are generated from this single TypeScript file, which performs better organization and maintainability.

you can see more examples here: [mcfn-ts](https://github.com/orgs/paul90317-minecraft/repositories?q=has%3Atopic+mcfn-ts)

## Installation
You can install the library via npm:
```bash
npm i mcfn.ts
```

## Configuration
Before using the library, you need to configure the datapack and resourcepack settings in the [`mcfn.json`](./mcfn.json) file:
```json
{
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
```
- `namespace`: The namespace for your datapack functions.
- `datapack`: Configuration for the datapack, including `mcmeta`, `outdir`, and `icon`.
- `resourcepack`: Configuration for the resourcepack, including `mcmeta`, `outdir`, and `icon`.
- `mcmeta`: Metadata for the pack, including description and pack format.
- `outdir`: The output directory for the generated pack.
- `icon`: Optional, the icon file for the pack.



## Building the Packs
You can use ts-node to build the datapack and resourcepack:
```bash
npx ts-node ./main.ts
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

If you want to contribute the codebase, before pushing your changes, make sure to run the build script:
```bash
yarn build
```