// https://minecraft.wiki/w/Loot_table
// https://minecraft.wiki/w/Item_modifier
// https://minecraft.wiki/w/Predicate

import { config } from "../config"
import fs from 'fs';
import { RegistryTag, FunctionTag, EntityTypeRef, BlockRef, FunctionRef, ItemTypeRef } from './tag'
import { object_to_json } from "./object";

type  REGISTRY_NAME = 'loot_table' | 'item_modifier' | 'predicate' | 'recipe'

export const registries: Record<string, Registry> = {}

export class Registry {
    private type: REGISTRY_NAME
    private name: string
    private data: object
    private namesp: string
    constructor(type: REGISTRY_NAME, data: object, namesp: string, name?: string) {
        this.type = type
        this.data = data
        this.namesp = namesp
        if(name) {
            if(name[0] === '_')
                throw new Error(`${type} name started with _ is not allowed.`)
            if(name in registries)
                throw new Error(`Duplicated ${type} name ${name}.`)
            this.name = name
        } else {
            this.name = `_${Object.keys(registries).length}`
        }
        registries[`${this.type}/${this}`] = this
        this.namesp = namesp
        this.data = data
    }
    public _create() {
        let dir = `${config.datapack.outdir}/data/${this.namesp}/${this.type}`
        fs.mkdirSync(dir, {
            recursive: true
        })
        fs.writeFileSync(`${dir}/${this.name}.json`, object_to_json(this.data))
    }
    public toString() {
        return `${this.namesp}:${this.name}`
    }
}

export class LootTable extends Registry {
    constructor(data: object, namesp: string, name?: string) {
        super('loot_table', data, namesp, name)
    }
}

export class Predicate extends Registry {
    constructor(data: object, namesp: string, name?: string) {
        super('predicate', data, namesp, name)
    }
}

export class ItemModifier extends Registry {
    constructor(data: object, namesp: string, name?: string) {
        super('item_modifier', data, namesp, name)
    }
}

export class Recipe extends Registry {
    constructor(data: object, namesp: string, name?: string) {
        super('recipe', data, namesp, name)
    }
}

export const datapack = {
    loot_table: (data: object, name?: string) => 
        new LootTable(data, config.namespace, name),
    item_modifier: (data: object, name?: string) => 
        new ItemModifier(data, config.namespace, name),
    predicate: (data: object, name?: string) => 
        new Predicate(data, config.namespace, name),
    recipe: (data: object, name?: string) =>
        new Recipe(data, config.namespace, name),
    tags: {
        entity_type: (values: readonly EntityTypeRef[], name?: string) => new RegistryTag<EntityTypeRef>(
            'entity_type', values, config.namespace, name),
        item: (values: readonly ItemTypeRef[], name?: string) => new RegistryTag<ItemTypeRef>(
            'item', values, config.namespace, name),
        block: (values: readonly BlockRef[], name?: string) => new RegistryTag<BlockRef>(
            'block', values, config.namespace, name),
        function: (values: readonly FunctionRef[], name?: string) => new FunctionTag(
            values, config.namespace, name
        )
    }
}