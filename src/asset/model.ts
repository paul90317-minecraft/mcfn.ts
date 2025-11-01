import fs from 'fs';
import { config } from '../config';
import { object_to_string } from '../util';

export const models: Record<string, Model> = {}

export class Model {
    private name: string
    constructor(private data: object, name?: string) {
        if(name) {
            if(name[0] == '_')
                throw new Error('Model name started with _ is not allowed.')
            if(name in models)
                throw new Error('Duplicated model name is not allowed.')
        } else {
            name = `_${Object.keys(models).length}`
        }
        this.name = name
        models[name] = this
    }
    _create() {
        const dir = `${config.resourcepack.outdir}/assets/${config.namespace}/models/`
        fs.mkdirSync(dir, {
            recursive: true
        })
        fs.writeFileSync(dir + `${this.name}.json`, object_to_string(this.data))
    }
    toString() {
        return `${config.namespace}:${this.name}`
    }
}