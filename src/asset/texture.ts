import fs from 'fs';
import { config } from '../config';

export const textures: Record<string, Texture> = {}

export class Texture {
    private name: string
    constructor(private path: string, private folder: string = '', name_prefix: string = '', name?: string) {
        if(name) {
            if(name[0] == '_')
                throw new Error('Texture name started with _ is not allowed.')
            if(name in textures)
                throw new Error('Duplicated texture name is not allowed.')
        } else {
            name = `_${Object.keys(textures).length}`
        }
        this.name = name_prefix + name
        textures[`${folder}/${name}`] = this
    }
    _create() {
        const dir = `${config.resourcepack.outdir}/assets/${config.namespace}/textures/` + this.folder
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

export class ItemTexture extends Texture {
    constructor(path: string, name?: string) {
        super(path, 'item/', 'item/' + name)
    }
}

type EQUIPMENTS = 'humanoid' | 'humanoid_leggings' | 'wings';
export class EquipmentTexture extends Texture {
    constructor(type: EQUIPMENTS, path: string, name?: string) {
        super(path, `entity/equipment/${type}/`, '', name)
    }
}

export const texture = {
    item(path: string, name?: string) {
        return new ItemTexture(path, name)
    },
    humanoid(type: EQUIPMENTS, path: string, name?: string) {
        return new EquipmentTexture(type, path, name)
    }
}