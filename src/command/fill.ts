// https://minecraft.fandom.com/wiki/Commands/fill
import { Command } from "../core/scope";
import { Block } from "./block"; // 假設 Block 類別來自 setblock 實作 [3]
import { Coordinate } from "../type/coord";

type FILL_MODE = 'destroy' | 'hollow' | 'keep' | 'outline' | 'strict';
type REPLACE_MODE = 'destroy' | 'hollow' | 'outline' | 'strict';

class BlockFill extends Command {
    constructor(
        private from: Coordinate,
        private to: Coordinate,
        private block: Block, 
        private mode: FILL_MODE 
    ) {
        super();
    }

    public toString(): string {
        // 核心語法: fill <from> <to> <block> [2]
        let command = `fill ${this.from} ${this.to} ${this.block}`;

        if (this.mode)
            command += ` ${this.mode}`;

        return command;
    }
}

class BlockReplace extends Command {
    constructor(
        private from: Coordinate,
        private to: Coordinate,
        private block: Block, 
        private filter?: Block,
        private mode?: REPLACE_MODE 
    ) {
        super();
    }

    public toString(): string {
        let command = `fill ${this.from} ${this.to} ${this.block}`;
        
        if (this.filter)
            command += ` ${this.filter}`;

        if (this.mode)
            command += ` ${this.mode}`;

        return command;
    }
}

function _fill(from: Coordinate, to: Coordinate, block: Block, mode: FILL_MODE) {
    new BlockFill(from, to, block, mode)
}

function _replace(from: Coordinate, to: Coordinate, block: Block, filter: Block, mode: REPLACE_MODE) {
    new BlockReplace(from, to, block, filter, mode)
}

export const fill = Object.assign(_fill, {
    replace: _replace
})
