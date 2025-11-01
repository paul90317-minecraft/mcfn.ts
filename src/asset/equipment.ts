import fs from 'fs';
import { config } from '../config';

export const equipments: Record<string, Equipment> = {}

export class Equipment {
    private name: string
    constructor(private data: object, name?: string) {
        if(name) {
            if(name[0] == '_')
                throw new Error('Equipment name started with _ is not allowed.')
            if(name in equipments)
                throw new Error('Duplicated equipment name is not allowed.')
        } else {
            name = `_${Object.keys(equipments).length}`
        }
        this.name = name
        equipments[name] = this
    }
    _create() {
        const dir = `${config.resourcepack.outdir}/assets/${config.namespace}/equipment/`
        fs.mkdirSync(dir, {
            recursive: true
        })
        fs.writeFileSync(dir + `${this.name}.json`, JSON.stringify(this.data))
    }
    toString() {
        return `${config.namespace}:${this.name}`
    }
}