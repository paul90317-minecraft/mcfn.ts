// https://minecraft.fandom.com/wiki/Commands/clear

import { Command } from "@/core/scope";
import { ITEMS } from "@/enum";
import { TARGET } from "@/type/selector"; 
// 假設存在 ItemPredicate 和 NBTCompound 類型，用於處理物品 ID 和 NBT

/**
 * 代表 Minecraft Java Edition 的 /clear 指令。
 */
class Clear extends Command {
    /**
     * 建構 Clear 類別。
     * @param targets 可選，指定要清除物品的玩家 (target selector)。
     * @param item 可選，指定要清除的物品 (item_predicate)。
     * @param maxCount 可選，要清除的最大數量 (integer)。
     */
    constructor(
        private targets?: TARGET,
        // JE: <item> : item_predicate (可能包含 NBT) [6]
        private item?: ITEMS, 
        // JE: <maxCount> : integer (0 到 2147483647) [7]
        private maxCount?: number 
    ) {
        super();
        
        // 來源要求：Java Edition 中 maxCount 必須介於 0 到 2147483647 之間 [7]。
        if (this.maxCount !== undefined && (this.maxCount < 0 || this.maxCount > 2147483647)) {
            // 由於 0 是用於偵測的有效值 [7]，只有當 maxCount 小於 0 時才需要額外的錯誤處理，
            // 但如果遵循 JE 嚴格限制（0到MAX），則應確保範圍。
            // 這裡假設我們只檢查非法的負數，儘管來源已給出 JE 必須在 [0, MAX] 範圍內 [7]。
            if (this.maxCount < 0) {
                 throw Error('maxCount must be no less than 0 in Java Edition');
            }
        }
    }

    public toString(): string {
        // 核心語法: clear
        let command = `clear`;

        // [<targets>]
        if (this.targets)
            command += ` ${this.targets}`;

        // [<item>]
        if (this.item)
            command += ` ${this.item}`;

        // [<maxCount>]
        // 注意：maxCount=0 是用於偵測的有效值，因此我們必須將 0 包含在內
        if (this.maxCount !== undefined)
            command += ` ${this.maxCount}`;

        return command;
    }
}

// 函數重載 (類似 playsound [13-15] 和 particle [16, 17] 的模式)
export function clear(targets?: TARGET, item?: ITEMS, maxCount?: number) {
    new Clear(targets, item, maxCount);
}