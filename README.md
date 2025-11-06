# mcfn.ts
This is a TypeScript library for building Minecraft function files, datapack, and resourcepack programmatically. 

## Features
- Create multiple mcfunctions in single file.
- Generate datapack and resourcepack structure in one project
- Use typescript to organize your mcfunction code

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

## Usage
Here is a simple example of how to use the library to create a Minecraft function file:
```typescript
minecraft.tick(() => {
    execute.as(sel('@a')).at(sel('@s')).run(() => {
        tp(sel('@e', {
            type: 'item',
            distance: {uppper: 8}
        }), sel('@p'))
    })
})
```
This code creates a tick function that teleports nearby items to each player, which increases item pickup range.

you can see more examples here: [mcfn-ts](https://github.com/orgs/paul90317-minecraft/repositories?q=has%3Atopic+mcfn-ts)

## Building the Pack
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