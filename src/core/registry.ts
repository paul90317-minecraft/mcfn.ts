// https://minecraft.wiki/w/Loot_table
// https://minecraft.wiki/w/Item_modifier
// https://minecraft.wiki/w/Predicate

import { config } from "@/config"
import fs from 'fs';

type  REGISTER = 'loot_table' | 'item_modifier' | 'predicate'

export const registry: Record<REGISTER,Record<string, RegistryEntry>> = {
    loot_table: {},
    item_modifier: {},
    predicate: {}
}

class RegistryEntry {
    private register: REGISTER
    private name: string
    public data: object
    constructor(register: REGISTER, data: object, name?: string) {
        this.register = register
        if(name) {
            if(name[0] === '_')
                throw new Error(`${register} name started with _ is not allowed.`)
            if(name in registry)
                throw new Error(`Duplicated ${register} name ${name}.`)
            this.name = name
        } else {
            this.name = `_${Object.keys(registry).length}`
        }
        registry[this.register][this.name] = this
        this.data = data
    }
    public _create() {
        let dir = `${config.outdir}/data/${config.namespace}/${this.register}`
        fs.mkdirSync(dir, {
            recursive: true
        })
        fs.writeFileSync(`${dir}/${this.name}`, JSON.stringify(this.data))
    }
    public toString() {
        return `${config.namespace}:${this.name}`
    }
}

export class ItemModifer extends RegistryEntry {
    constructor(data: object, name?: string) {
        super('item_modifier', data, name)
    }
}

export class Predicate extends RegistryEntry {
    constructor(data: object, name?: string) {
        super('predicate', data, name)
    }
}

export class LootTable extends RegistryEntry {
    constructor(data: object, name?: string) {
        super('loot_table', data, name)
    }
}