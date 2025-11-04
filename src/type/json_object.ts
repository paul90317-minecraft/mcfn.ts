// 所有屬性名稱列舉
export type ITEM_ATTRIBUTES =
  | "minecraft:armor"
  | "minecraft:armor_toughness"
  | "minecraft:attack_damage"
  | "minecraft:attack_knockback"
  | "minecraft:attack_speed"
  | "minecraft:block_break_speed"
  | "minecraft:block_interaction_range"
  | "minecraft:burning_time"
  | "minecraft:camera_distance"
  | "minecraft:entity_interaction_range"
  | "minecraft:explosion_knockback_resistance"
  | "minecraft:fall_damage_multiplier"
  | "minecraft:flying_speed"
  | "minecraft:follow_range"
  | "minecraft:gravity"
  | "minecraft:jump_strength"
  | "minecraft:knockback_resistance"
  | "minecraft:luck"
  | "minecraft:max_absorption"
  | "minecraft:max_health"
  | "minecraft:mining_efficiency"
  | "minecraft:movement_efficiency"
  | "minecraft:movement_speed"
  | "minecraft:oxygen_bonus"
  | "minecraft:safe_fall_distance"
  | "minecraft:scale"
  | "minecraft:sneaking_speed"
  | "minecraft:spawn_reinforcements"
  | "minecraft:step_height"
  | "minecraft:submerged_mining_speed"
  | "minecraft:sweeping_damage_ratio"
  | "minecraft:tempt_range"
  | "minecraft:water_movement_efficiency"
  | "minecraft:waypoint_receive_range"
  | "minecraft:waypoint_transmit_range";


// 操作型別
export type ATTRIBUTE_OPTION = "add_value" | "add_multiplied_total" | "add_multiplied_base"

// 插槽型別
export type ATTRIBUTE_SLOT = "mainhand" | "offhand" | "head" | "chest" | "legs" | "feet" | 'hand' | 'armor' | 'any' | 'body' | 'saddle' ;

// 屬性修飾子結構
export interface ATTRIBUTE_MODIFIER {
  type: ITEM_ATTRIBUTES;
  id: string;           // 例如 "attack_damage"
  amount: number;       // 數值
  operation: ATTRIBUTE_OPTION;
  slot?: ATTRIBUTE_SLOT;  // 可選，有些沒有 slot
}


import { EquipmentTexture, ItemModel, ItemTexture, Model } from "../asset"
import { Equipment } from "../asset/equipment"
import { ItemModifier, LootTable, Predicate, Recipe, Registry } from "../core/registry"
import { RegistryTag } from "../core/tag"
import { NBTBase } from "./nbt"

type CUSTOM_TYPES = Registry | RegistryTag<any> | ItemTexture | Equipment | EquipmentTexture | ItemModel | Model | NBTBase | ItemModifier | LootTable | Predicate | Recipe

type OBJECT_TYPES = string | number | boolean | object | CUSTOM_TYPES
export function object_to_string(obj: object): string {
    function helper(x: OBJECT_TYPES) {
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
        return object_to_string(x)
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
