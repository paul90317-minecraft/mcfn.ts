// https://minecraft.wiki/w/Loot_table
// https://minecraft.wiki/w/Item_modifier
// https://minecraft.wiki/w/Predicate

import { config } from "../config"
import fs from 'fs';
import { tag } from './tag'

type  REGISTRY_NAME = 'loot_table' | 'item_modifier' | 'predicate' | 'recipe'

export const registries: Record<string, Registry> = {}

export class Registry {
    private type: REGISTRY_NAME
    private name: string
    private data?: object
    private namesp: string
    constructor(arg: {type: REGISTRY_NAME, data?: object, namesp: string, name?: string}) {
        this.type = arg.type
        if(!arg.name && !arg.data)
            throw new Error(`${arg.type} name and data is not allowed to be zero at the same time.`)
        if(arg.name) {
            if(arg.name[0] === '_')
                throw new Error(`${arg.type} name started with _ is not allowed.`)
            if(arg.name in registries)
                throw new Error(`Duplicated ${arg.type} name ${arg.name}.`)
            this.name = arg.name
        } else {
            this.name = `_${Object.keys(registries).length}`
        }
        registries[`${this.type}/${this}`] = this
        this.namesp = arg.namesp
        if(arg.data)
            this.data = arg.data
    }
    public _create() {
        if(!this.data)
            return;
        let dir = `${config.datapack.outdir}/data/${this.namesp}/${this.type}`
        fs.mkdirSync(dir, {
            recursive: true
        })
        fs.writeFileSync(`${dir}/${this.name}.json`, JSON.stringify(this.data))
    }
    public toString() {
        return `${this.namesp}:${this.name}`
    }
}

export class LootTable extends Registry {
    constructor(opt: {data?: object, namesp: string, name?: string}) {
        super({...opt, type: 'loot_table'})
    }
}

export class Predicate extends Registry {
    constructor(opt: {data?: object, namesp: string, name?: string}) {
        super({...opt, type: 'predicate'})
    }
}

export class ItemModifier extends Registry {
    constructor(opt: {data?: object, namesp: string, name?: string}) {
        super({...opt, type: 'item_modifier'})
    }
}

export class Recipe extends Registry {
    constructor(opt: {data?: object, namesp: string, name?: string}) {
        super({...opt, type: 'recipe'})
    }
}

export const datapack = {
    loot_table: (arg: {data?: object, name?: string}) => 
        new LootTable({...arg, namesp: config.namespace}),
    item_modifier: (arg: {data?: object, name?: string}) => 
        new ItemModifier({...arg, namesp: config.namespace}),
    predicate: (arg: {data?: object, name?: string}) => 
        new Predicate({...arg, namesp: config.namespace}),
    recipe: (arg: {data?: object, name?: string}) =>
        new Recipe({...arg, namesp: config.namespace}),
    tags: tag
}