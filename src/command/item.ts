// https://minecraft.fandom.com/wiki/Item
// https://minecraft.wiki/w/Data_component_format#List_of_components

import { TARGET } from "@/type/selector";
import { Coordinate } from "@/type/coord";
import { ITEM_SLOTS, SLOT_WILDCARD } from "@/enum/extend/item_slot";
import { ITEMS } from "@/enum";
import { COMPONENTS, EXCL_COMPONENTS } from "@/enum/extend/component";
import { NBTBase } from "@/type/nbt";
import { Command } from "@/core/scope";
import { ItemModifer } from "@/core/registry";
import { Condition } from "./execute";
import { ItemTag } from "@/core/tag";

export class Slot {
    private target: TARGET | Coordinate
    private slot: ITEM_SLOTS | SLOT_WILDCARD
    constructor(target: TARGET | Coordinate, slot: ITEM_SLOTS) {
        this.target = target
        this.slot = slot
    }
    public replace(source: Item, count?: number): void
    public replace(source: Slot, modifier?: ItemModifer): void
    public replace(source: Item | Slot, status?: number | ItemModifer) {
        if(this.slot.at(-1) == '*')
            throw new Error('The slot can not be wildcard when replacing.')
        if(source instanceof Item)
            new ItemReplaceWith(this, source, (status ?? 1) as number)
        else
            new ItemReplaceFrom(this, source, status as ItemModifer)
    }
    public modify(mod: ItemModifer) {
        if(this.slot.at(-1) == '*')
            throw new Error('The slot can not be wildcard when modifying.')
        new ItemModify(this, mod)
    }
    public matches(item: Item) {
        return new ItemMatch(this, item)
    }
    public toString() {
        let prefix = (this.target instanceof Coordinate ? 'block' : 'entity') 
        return `${prefix} ${this.target} ${this.slot}`
    }
}

class ItemReplaceWith extends Command {
    private target: Slot
    private item: Item
    private count: number
    constructor(target: Slot, source: Item, count: number) {
        super()
        this.target = target
        this.item = source
        this.count = count
    }
    public toString(): string {
        return `item replace ${this.target} with ${this.item} ${this.count}`
    }
}

class ItemReplaceFrom extends Command {
    private target: Slot
    private source: Slot
    private mod?: ItemModifer
    constructor(target: Slot, source: Slot, mod?: ItemModifer) {
        super()
        this.target = target
        this.source = source
        if(mod)
            this.mod = mod
    }
    public toString(): string {
        let subfix = this.mod ? ' ' + this.mod : ''
        return `item replace ${this.target} from ${this.source}` + subfix
    }
}

class ItemModify extends Command {
    private target: Slot
    private mod: ItemModifer
    constructor(target: Slot, mod: ItemModifer) {
        super()
        this.target = target
        this.mod = mod
    }
    public toString(): string {
        let subfix = this.mod ? ' ' + this.mod : ''
        return `item modify ${this.target} ${this.mod}`
    }
}

export class Item {
    private item: ITEMS | '*' | ItemTag
    private components?: Record<COMPONENTS | EXCL_COMPONENTS, NBTBase>
    constructor(item: ITEMS, component?: Record<COMPONENTS | EXCL_COMPONENTS, NBTBase>) {
        this.item = item
        if(component)
            this.components = component
    }
    public toString() {
        if(this.components === undefined)
            return this.item
        let temp = Object.entries(this.components!)
            .map(([k, v]) => `${k}=${v}`)
            .join(',');
        return `${this.item}[${temp}]`
    }
}

class ItemMatch extends Condition {
    constructor(private slot: Slot, private item: Item) {
        super()
    }
    public toString(): string {
        return `items ${this.slot} ${this.item}`
    }
}