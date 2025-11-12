// 操作型別
export type AttributeOption = "add_value" | "add_multiplied_total" | "add_multiplied_base"

// 插槽型別
export type AttributeSlot = "mainhand" | "offhand" | "head" | "chest" | "legs" | "feet" | 'hand' | 'armor' | 'any' | 'body' | 'saddle' ;

// 屬性修飾子結構
export interface AttributeModifierObject {
  type: AttributeID;
  id: string;           // 例如 "attack_damage"
  amount: number;       // 數值
  operation: AttributeOption;
  slot?: AttributeSlot;  // 可選，有些沒有 slot
}

// https://minecraft.fandom.com/wiki/Formatting_codes
export type FormatID =
  | 'obfuscated'
  | 'bold'
  | 'strikethrough'
  | 'underline'
  | 'italic';

export type TextObject = {
  text: string,
  color?: ColorID,
} & Partial<Record<FormatID, boolean>>

import { EquipmentTexture, ItemModel, ItemTexture, Model } from "../asset"
import { Equipment } from "../asset/equipment"
import { ItemModifier, LootTable, Predicate, Recipe, Registry } from "./registry"
import { RegistryTag } from "./tag"
import { AttributeID } from "../mcmeta";
import { ColorID } from "../mcmeta/command_argument_type";
import { NBTBase } from "../arg/nbt"

type ObjectType = Registry | RegistryTag<any> | ItemTexture | Equipment | EquipmentTexture | ItemModel | Model | NBTBase | ItemModifier | LootTable | Predicate | Recipe | string | number | boolean | object

export function object_to_json(obj: object): string {
    function helper(x: ObjectType) {
        if (
            x instanceof Registry ||
            x instanceof RegistryTag ||
            x instanceof ItemTexture ||
            x instanceof Equipment ||
            x instanceof EquipmentTexture ||
            x instanceof ItemModel ||
            x instanceof Model ||
            x instanceof NBTBase ||
            x instanceof ItemModifier ||
            x instanceof LootTable ||
            x instanceof Predicate ||
            x instanceof Recipe ||
            typeof x === 'string'
        )
            return `"${x}"`
            
        if (typeof x === 'number')
            return x
        if (typeof x === 'boolean')
            return x ? 'true' : 'false'
        return object_to_json(x)
    }
    if (obj instanceof Array) {
        let x = obj.map(x => helper(x))
        return `[${x.join(',')}]`
    }
    let entries = Object.entries(obj).map(([k, v]) => {
        if(v === undefined)
            return undefined
        return `"${k}":${helper(v)}`;
    }).filter(kv => kv !== undefined)
    return `{${entries.join(',')}}`;
}
