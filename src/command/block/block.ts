// https://minecraft.fandom.com/wiki/Block_states
// https://minecraft.fandom.com/wiki/Commands/setblock

// 假設的類型引用，參考自其他指令實作 [1, 2]
import { Command } from "../../core/scope";
import { Coordinate } from "../../type/coord";
import { NBTBase, NBTCompound } from "../../type/nbt";
import { Condition } from "../../type/condition";
import { BLOCK } from "../../core/tag";
import { BlockFill, BlockReplace, FILL_MODE, REPLACE_MODE } from "./fill";

// 處理 setblock 指令模式
export type SETBLOCK_MODE = 'destroy' | 'keep' | 'replace' | 'strict';

export class Block {
    constructor(
        private block: BLOCK,
        private state?: Record<string, string>,
        private entity_tags?: NBTCompound<Record<string, NBTBase>>
    ) {
    }
    public toString() {
        let b = `${this.block}`
        if(this.state)
            b += '[' + Object.entries(this.state).map(([k,v])=>{
                return `${k}=${v}`
            }).join(',') + ']'
        if(this.entity_tags)
            b += this.entity_tags
        return b
    }

    public replace(from: Coordinate, to: Coordinate, filter?: Block, mode?: REPLACE_MODE) {
        new BlockReplace(from, to, this, filter, mode)
    }
    public fill(from: Coordinate, to: Coordinate, mode?: FILL_MODE) {
        new BlockFill(from, to, this, mode)
    }
    set(pos: Coordinate, mode?: SETBLOCK_MODE) {
        new Setblock(pos, this, mode);
    }

    matches(pos: Coordinate) {
        return new BlockMatch(pos, this)
    }
}

class BlockMatch extends Condition {
    constructor(public pos: Coordinate, public block: Block) {
        super()
    }
    public toString(): string {
        return `block ${this.pos} ${this.block}`
    }
}

class Setblock extends Command {
    constructor(
        private pos: Coordinate, // 必須是 block_pos [3]
        private block: Block,    // 必須包含 block_id[block_states]{data_tags} [4]
        private mode?: SETBLOCK_MODE
    ) {
        super();
        // 在實際的實作中，可能會對 pos 和 block 參數進行類型或格式檢查。
    }

    public toString(): string {
        // 核心語法: setblock <pos> <block> [3]
        let command = `setblock ${this.pos} ${this.block}`;

        // [destroy|keep|replace] [3, 5]
        if (this.mode) {
            command += ` ${this.mode}`;
        }
        
        return command;
    }
}

export function block(
    block: BLOCK, state?: Record<string, string>, entity_tags?: NBTCompound<Record<string, NBTBase>>
) {
    return new Block(block, state, entity_tags)
}
