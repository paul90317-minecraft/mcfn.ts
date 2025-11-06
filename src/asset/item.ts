import fs from 'fs';
import { config } from '../config';
import { object_to_json } from '../core';

export const item_models: Record<string, ItemModel> = {}

export class ItemModel {
    private name: string
    constructor(private data: object, name?: string) {
        if(name) {
            if(name[0] == '_')
                throw new Error('Item model name started with _ is not allowed.')
            if(name in item_models)
                throw new Error('Duplicated item model name is not allowed.')
        } else {
            name = `_${Object.keys(item_models).length}`
        }
        this.name = name
        item_models[name] = this
    }
    _create() {
        const dir = `${config.resourcepack.outdir}/assets/${config.namespace}/items/`
        fs.mkdirSync(dir, {
            recursive: true
        })
        fs.writeFileSync(dir + `${this.name}.json`, object_to_json(this.data))
    }
    toString() {
        return `${config.namespace}:${this.name}`
    }
}