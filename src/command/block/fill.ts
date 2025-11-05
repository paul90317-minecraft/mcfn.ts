// https://minecraft.fandom.com/wiki/Commands/fill
import { Command } from "../../core/scope";
import { Block } from "./block"; // 假設 Block 類別來自 setblock 實作 [3]
import { Vec3 } from "../../arg/vec3";

export type FILL_MODE = 'destroy' | 'hollow' | 'keep' | 'outline' | 'strict';
export type REPLACE_MODE = 'destroy' | 'hollow' | 'outline' | 'strict';

export class BlockFill extends Command {
    constructor(
        private from: Vec3,
        private to: Vec3,
        private block: Block, 
        private mode?: FILL_MODE 
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

export class BlockReplace extends Command {
    constructor(
        private from: Vec3,
        private to: Vec3,
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
