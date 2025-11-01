// https://zh.minecraft.wiki/w/%E6%A0%87%E7%AD%BE?variant=zh-tw

import { BLOCKS, ENTITY_TYPES, ITEMS } from "../enum"
import { MCFunction, functions } from "../command/function"
import fs from 'fs';
import { config } from "../config";
import { raw } from "../command";
import { ENTITY_TYPE_TAG } from "../enum/tag/entity_type";
import { ITEM_TAG } from "../enum/tag/item";
import { BLOCK_TAG } from "../enum/tag/block";
import { object_to_string } from "../util";

export const registry_tags: Record<string, RegistryTag<any>> = {}

type REGISTRY_TAGS = 'entity_type' | 'block' | 'function' | 'item';
export type TAG<T> = RegistryTag<T> | T;

export class RegistryTag<T> {
    private name: string
    private values: T[]
    private type: REGISTRY_TAGS
    private namesp: string
    constructor(type: REGISTRY_TAGS, values: T[], namesp: string, name?: string) {
        if (name) {
            if (name[0] === "_")
                throw new Error("Custom tag starting with _ is not allowed.")
            if (name in tag)
                throw new Error("Duplicated tag declaration.")
            this.name = name
            
        } else {
            this.name = `_${Object.keys(tag).length}`
        }
        this.values = values
        registry_tags[type + this] = this
        this.type = type
        this.namesp = namesp
    }

    toString() {
        return `#${this.namesp}:${this.name}`
    }

    _create() {
        let data = object_to_string({ values: this.values.map(v => `${v}`) })
        let directory = `${config.datapack.outdir}/data/${this.namesp}/tags/${this.type}`
        fs.mkdirSync(directory, {
            recursive: true
        })
        fs.writeFileSync(`${directory}/${this.name}.json`, data);
    }
}

export class FunctionTag extends RegistryTag<TAG<MCFunction>> {
    constructor(values: TAG<MCFunction>[], namesp: string, name?: string) {
        super('function', values, namesp, name)
    }
    public call() {
        raw(`function ${this}`)
    }
}

export type ENTITY_TYPE = TAG<ENTITY_TYPES | `#${ENTITY_TYPE_TAG}`>
export type ITEM = TAG<ITEMS | `#${ITEM_TAG}` | '*'>
export type BLOCK = TAG<BLOCKS | `#${BLOCK_TAG}`>

export const tag = {
    entity_type: (values: ENTITY_TYPE[], name?: string) => new RegistryTag<ENTITY_TYPE>(
        'entity_type', values, config.namespace, name),
    item: (values: ITEM[], name?: string) => new RegistryTag<ITEM>(
        'item', values, config.namespace, name),
    block: (values: BLOCK[], name?: string) => new RegistryTag<BLOCK>(
        'block', values, config.namespace, name)
}
