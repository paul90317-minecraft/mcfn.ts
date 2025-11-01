import fs from 'fs';
import { config } from '../config';

export const item_textures: Record<string, ItemTexture> = {}
export const humanoid_textures: Record<string, HumanoidTexture> = {}

export class ItemTexture {
    private name: string
    constructor(private path: string, name?: string) {
        if(name) {
            if(name[0] == '_')
                throw new Error('Texture name started with _ is not allowed.')
            if(name in item_textures)
                throw new Error('Duplicated texture name is not allowed.')
        } else {
            name = `_${Object.keys(item_textures).length}`
        }
        this.name = name
        item_textures[name] = this
    }
    _create() {
        const dir = `${config.resourcepack.outdir}/assets/${config.namespace}/textures/item/`
        fs.mkdirSync(dir, {
            recursive: true
        })
        const ext = this.path.split('.').at(-1)
        fs.copyFileSync(this.path, dir + `${this.name}.${ext}`)
    }
    toString() {
        return `${config.namespace}:item/${this.name}`
    }
}

export class HumanoidTexture {
    private name: string
    constructor(private path: string, name?: string) {
        if(name) {
            if(name[0] == '_')
                throw new Error('Texture name started with _ is not allowed.')
            if(name in humanoid_textures)
                throw new Error('Duplicated texture name is not allowed.')
        } else {
            name = `_${Object.keys(humanoid_textures).length}`
        }
        this.name = name
        humanoid_textures[name] = this
    }
    _create() {
        const dir = `${config.resourcepack.outdir}/assets/${config.namespace}/textures/entity/equipment/humanoid/`
        fs.mkdirSync(dir, {
            recursive: true
        })
        const ext = this.path.split('.').at(-1)
        fs.copyFileSync(this.path, dir + `${this.name}.${ext}`)
    }
    toString() {
        return `${config.namespace}:${this.name}`
    }
}

export const texture = {
    item(path: string, name?: string) {
        return new ItemTexture(path, name)
    },
    humanoid(path: string, name?: string) {
        return new HumanoidTexture(path, name)
    }
}