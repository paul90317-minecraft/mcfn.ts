// https://minecraft.fandom.com/wiki/Item
// https://minecraft.wiki/w/Data_component_format#List_of_components
// https://minecraft.fandom.com/wiki/Commands/clear

import { TARGET } from "../type/selector";
import { Coordinate } from "../type/coord";
import { ITEM_SLOTS, SLOT_WILDCARD } from "../enum/extend/item_slot";
import { ITEMS } from "../enum";
import { COMPONENTS, EXCL_COMPONENTS } from "../enum/extend/component";
import { NBTBase } from "../type/nbt";
import { Command } from "../core/scope";
import { ItemModifer } from "../core/registry";
import { Condition } from "../type/condition";
import { ItemTag } from "../core/tag";

export class Slot {
    private target: TARGET | Coordinate
    private slot: ITEM_SLOTS | SLOT_WILDCARD
    constructor(target: TARGET | Coordinate, slot: ITEM_SLOTS) {
        this.target = target
        this.slot = slot
    }
    public replace = {
        with: (item: Item, count?: number) => {
            if(this.slot.at(-1) == '*')
                throw new Error('The slot can not be wildcard when modifying.')
            new ItemReplaceWith(this, item, count)
        },
        from: (source: Slot, mod?: ItemModifer) => {
            if(this.slot.at(-1) == '*')
                throw new Error('The slot can not be wildcard when modifying.')
            new ItemReplaceFrom(this, source, mod)
        }
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
    constructor(private target: Slot, private item: Item, private count?: number) {
        super()
    }
    public toString(): string {
        let base = `item replace ${this.target} with ${this.item}`
        if(this.count)
            base += `  ${this.count}`
        return base
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
    public clear(target?: TARGET, maxCount?: number) {
        new Clear(target, this, maxCount)
    }
    public give(target: TARGET, count?: number){
        new Give(target, this, count)
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

class Clear extends Command {
    constructor(
        private targets?: TARGET,
        private item?: Item, 
        private maxCount?: number 
    ) {
        super();
        if (this.maxCount !== undefined && (this.maxCount < 0 || this.maxCount > 2147483647)) {
            throw Error('maxCount must be no less than 0 in Java Edition');
        }
    }

    public toString(): string {
        let command = `clear`;

        if (this.targets)
            command += ` ${this.targets}`;

        if (this.item)
            command += ` ${this.item}`;

        if (this.maxCount !== undefined)
            command += ` ${this.maxCount}`;

        return command;
    }
}

class Give extends Command {
    constructor(
        private target: TARGET,
        private item: Item,
        private count?: number
    ) {
        super();
        if (count !== undefined && (count < 1 || count > 2147483647)) {
            throw new Error(`Count must be between 1 and 2147483647 (inclusive) in Java Edition.`);
        }
        this.count = count;
    }

    public toString(): string {
        let command = `give ${this.target} ${this.item}`;

        if (this.count !== undefined) {
            command += ` ${this.count}`;
        }
        
        return command;
    }
}

export const item = Object.assign((it: ITEMS, comp: Record<COMPONENTS | EXCL_COMPONENTS, NBTBase>)=>new Item(it, comp), {
    slot: (tar: Coordinate | TARGET, slot: ITEM_SLOTS)=>new Slot(tar, slot)
})