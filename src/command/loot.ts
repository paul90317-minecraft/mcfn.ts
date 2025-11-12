// https://minecraft.fandom.com/wiki/Commands/loot
import { LootTable } from "../file/registry";
import { Command } from "../core/scope";
import { Vec3 } from "../arg/vec3";
import { TARGET } from "../arg/selector";
import { Item, Slot } from "./item";

type TOOLS = Item | 'mainhand' | 'offhand'

class BaseSource {
    constructor() {

    }
    public give (target: TARGET) {
        new LootGive(target, this)
    }
    public insert(pos: Vec3) {
        new LootInsert(pos, this)
    }
    public replace(slot: Slot, count?: number) {
        new LootReplace(slot, this, count)
    }
    public spawn(pos: Vec3) {
        new LootSpawn(pos, this)
    }
}

class FishSource extends BaseSource{
    constructor(private loot: LootTable, private pos: Vec3, private tool?: TOOLS) {
        super()
    }
    public toString() {
        let s = `fish ${this.loot} ${this.pos}`
        if(this.tool)
            s += ' ' + this.tool
        return s
    }
}

class LootSource extends BaseSource {
    constructor(private loot: LootTable)  {
        super()
    }
    public toString() {
        return `loot ${this.loot}`
    }
}

class KillSource extends BaseSource {
    constructor(private target: TARGET) {
        super()
    }
    public toString() {
        return `kill ${this.target}`
    }
}

class MineSource extends BaseSource {
    constructor(private pos: Vec3, private tool?: TOOLS) {
        super()
    }
    public toString() {
        let s = `mine ${this.pos}`
        if(this.tool)
            s += ' ' + this.tool
        return s
    }
}

class LootGive extends Command {
    constructor(private players: TARGET, private source: BaseSource) { super(); }
    public toString() {
        return `loot give ${this.players} ${this.source}`;
    }
}

class LootInsert extends Command {
    constructor(private pos: Vec3, private source: BaseSource) { super(); }
    public toString() {
        return `loot insert ${this.pos} ${this.source}`;
    }
}

class LootSpawn extends Command {
    constructor(private pos: Vec3, private source: BaseSource) { super(); }
    public toString() {
        return `loot spawn ${this.pos} ${this.source}`;
    }
}

class LootReplace extends Command {
    constructor(private slot: Slot, private source: BaseSource, private count?: number) { super(); }
    public toString() {
        let cmd = `loot replace ${this.slot} ${this.source}`;
        if (this.count !== undefined) cmd += ` ${this.count}`;
        return cmd;
    }
} 

export const loot = Object.assign((loot: LootTable) => new LootSource(loot), {
    // target actions
    fish: (loot: LootTable, pos: Vec3, tool: TOOLS) => new FishSource(loot, pos, tool),
    mine: (pos: Vec3, tool: TOOLS) => new MineSource(pos, tool),
    kill: (entity: TARGET) => new KillSource(entity)
});

