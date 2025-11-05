// https://minecraft.wiki/w/Commands/summon

import { Command } from "../core/scope";
import { Vec3 } from "../arg/vec3"; 
import { EntityTypeID } from "../mcmeta"; 
import { NBTBase, NBTCompound } from "../arg/nbt";

/**
 * 代表 Minecraft Java Edition 的 /summon 指令。
 */
class Summon extends Command {

    /**
     * 建構 Summon 類別。
     * @param entityType 指定要召喚的實體 (resource location)。
     * @param pos 可選，召喚實體的位置 (vec3)。
     * @param nbt 可選，實體的資料標籤 (nbt_compound_tag)。
     */
    constructor(
        private entityType: EntityTypeID,
        private pos?: Vec3,
        private nbt?: NBTCompound<Record<string, NBTBase>>
    ) {
        super();
    }

    public toString(): string {
        // 核心語法: summon <entityType> [1]
        let command = `summon ${this.entityType}`;

        // [<pos>]
        if (this.pos)
            command += ` ${this.pos}`;

        // [<nbt>]
        if (this.nbt)
            command += ` ${this.nbt}`;

        return command;
    }

}

export function summon(entityType: EntityTypeID, pos?: Vec3, nbt?: NBTCompound<Record<string, NBTBase>>) {
    new Summon(entityType, pos, nbt)
}