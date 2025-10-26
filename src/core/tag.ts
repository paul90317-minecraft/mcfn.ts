// https://zh.minecraft.wiki/w/%E6%A0%87%E7%AD%BE?variant=zh-tw

import { BLOCKS, ENTITY_TYPES, ITEMS } from "../enum"
import { MCFunction, functions } from "../command/function"
import fs from 'fs';
import { config } from "../config";

type TagRegistry<T> = Record<string, RegistryTag<T>>

type DP_TAGS = 'entity_type' | 'block' | 'function' | 'item';

export class RegistryTag<T> {
    private name: string
    protected values: T[]
    private register: DP_TAGS
    private namesp: string
    protected constructor(register: DP_TAGS, registry: TagRegistry<T>, values: T[], namesp: string, name?: string) {
        if (name) {
            if (name[0] === "_")
                throw new Error("Custom tag starting with _ is not allowed.")
            if (name in registry)
                throw new Error("Duplicated tag declaration.")
            this.name = name
            
        } else {
            this.name = `_${Object.keys(registry).length}`
        }
        this.values = values
        registry[this.name] = this
        this.register = register
        this.namesp = namesp
    }

    toString() {
        return `${this.namesp}:${this.name}`
    }

    _create() {
        let data = JSON.stringify({ values: this.values.map(v=>`${v}`) })
        let directory = `${config.outdir}/data/${this.namesp}/tags/${this.register}`
        fs.mkdirSync(directory, {
            recursive: true
        })
        fs.writeFileSync(`${directory}/${this.name}.json`, data);
    }
}

export class EntityTypeTag extends RegistryTag<ENTITY_TYPES | EntityTypeTag> {
    private static tags: TagRegistry<ENTITY_TYPES | EntityTypeTag> = {}
    constructor(values: (ENTITY_TYPES | EntityTypeTag)[], name?: string) {
        super('entity_type', EntityTypeTag.tags, values, config.namespace, name)
    }
    static _create() {
        for(let tag of Object.values(EntityTypeTag.tags))
            tag._create()
    }
}

export class ItemTag extends RegistryTag<ITEMS | ItemTag> {
    private static tags: TagRegistry<ITEMS | ItemTag> = {}
    constructor(values: (ITEMS | ItemTag)[], name?: string) {
        super('item', ItemTag.tags, values, config.namespace, name)
    }
    static _create() {
        for(let tag of Object.values(ItemTag.tags))
            tag._create()
    }
}

export class BlockTag extends RegistryTag<BLOCKS | BlockTag> {
    static tags: TagRegistry<BLOCKS | BlockTag> = {}
    constructor(values: (BLOCKS | BlockTag)[], name?: string) {
        super('block', BlockTag.tags, values, config.namespace, name)
    }
    static _create() {
        for(let tag of Object.values(BlockTag.tags))
            tag._create()
    }
}

export class FunctionTag extends RegistryTag<MCFunction | FunctionTag> {
    static tags: TagRegistry<MCFunction | FunctionTag> = {}
    constructor(values: (MCFunction | FunctionTag)[], name?: string) {
        super('function', FunctionTag.tags, values, config.namespace, name)
    }
    static _create() {
        for(let tag of Object.values(FunctionTag.tags))
            tag._create()
    }
    public call() {
        this.values.forEach(fn=>fn.call())
    }
}
