import { EquipmentTexture, ItemModel, ItemTexture, Model } from "./asset"
import { Equipment } from "./asset/equipment"
import { ItemModifier, LootTable, Predicate, Recipe, Registry } from "./core/registry"
import { RegistryTag } from "./core/tag"
import { NBTBase } from "./type"

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


