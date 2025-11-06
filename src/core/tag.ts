// https://zh.minecraft.wiki/w/%E6%A0%87%E7%AD%BE?variant=zh-tw

import { BlockId, EntityTypeID, ItemID } from "../mcmeta"
import { MCFunction, functions } from "../command/function"
import fs from 'fs';
import { config } from "../config";
import { raw } from "../command";
import { EntityTypeTagID } from "../mcmeta/tag/entity_type";
import { ItemTagID } from "../mcmeta/tag/item";
import { BlockTagID } from "../mcmeta/tag/block";
import { object_to_json } from "./object";

export const registry_tags: Record<string, RegistryTag<any>> = {}

type RegisterTagID = 'entity_type' | 'block' | 'function' | 'item';
export type WithTag<T> = RegistryTag<WithTag<T>> | T;

export class RegistryTag<T> {
    private name: string

    constructor(public type: RegisterTagID, public values: readonly T[], private namesp: string, name?: string) {
        if (name) {
            if (name[0] === "_")
                throw new Error("Custom tag starting with _ is not allowed.")
            if (name in registry_tags)
                throw new Error("Duplicated tag declaration.")
            this.name = name
        } else {
            this.name = `_${Object.keys(registry_tags).length}`
        }

        this.type = type
        this.namesp = namesp

        // 這裡 key 用 toString 方便
        registry_tags[type + this] = this
    }

    toString() {
        return `#${this.namesp}:${this.name}`
    }

    _create() {
        let data = object_to_json({ values: this.values.map(v => `${v}`) }) // 直接 map this
        let directory = `${config.datapack.outdir}/data/${this.namesp}/tags/${this.type}`
        fs.mkdirSync(directory, { recursive: true })
        fs.writeFileSync(`${directory}/${this.name}.json`, data)
    }
    *[Symbol.iterator]() {
        for(let x of this.values)
            yield x
    }
}


export type FunctionRef = WithTag<MCFunction>
export type EntityTypeRef = WithTag<EntityTypeID | `#${EntityTypeTagID}`>
export type ItemRef = WithTag<ItemID | `#${ItemTagID}`> | '*' 
export type BlockRef = WithTag<BlockId | `#${BlockTagID}`>

export class FunctionTag extends RegistryTag<FunctionRef> {
    constructor(values: readonly FunctionRef[], namesp: string, name?: string) {
        super('function', values, namesp, name)
    }
    public call() {
        raw(`function ${this}`)
    }
}
