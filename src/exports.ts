import { MCFunction } from "./file/function";
import { bossbars } from "./command/bossbar";
import { objectives } from "./command/scoreboard/objective";
import { teams } from "./command/team";
import { config } from "./config";
import { BlockRef, EntityTypeRef, FunctionTag, ItemModifier, ItemRef, LootTable, object_to_json, registry_tags, RegistryTag } from "./file";
import fs from 'fs'
import { Predicate, Recipe, registries } from "./file/registry";
import { functions } from "./file/function";
import { EquipmentTexture, item_models, ItemModel, ItemTexture, Model, models, textures } from "./asset";
import { Equipment, equipments } from "./asset/equipment";

export class minecraft {
    private constructor() {}
    private static _tick: MCFunction | undefined;
    private static _load: MCFunction | undefined;
    static tick(fn: ()=>void) {
        if(this._tick)
            throw new Error('Duplicated tick function defined.')
        this._tick = new MCFunction(fn)
    }
    static load(fn: ()=>void) {
        if(this._load)
            throw new Error('Duplicated load function defined.')
        this._load = new MCFunction(fn)
    }
    static _create() {
        if(this._load || Object.keys(objectives).length)
            new FunctionTag([
                new MCFunction(()=>{
                    Object.values(objectives).forEach(obj=>obj._create())
                    Object.values(bossbars).forEach(obj=>obj._create())
                    Object.values(teams).forEach(obj=>obj._create())
                    this._load?.call()
                })
            ] , 'minecraft','load')._create()
    
        if(this._tick){
            new FunctionTag([
                this._tick
            ], 'minecraft', 'tick')._create()
        }
    }
}

export const datapack = {
    loot_table: (data: object, name?: string) => 
        new LootTable(data, config.namespace, name),
    item_modifier: (data: object, name?: string) => 
        new ItemModifier(data, config.namespace, name),
    predicate: (data: object, name?: string) => 
        new Predicate(data, config.namespace, name),
    recipe: (data: object, name?: string) =>
        new Recipe(data, config.namespace, name),
    tags: {
        entity_type: (values: readonly EntityTypeRef[], name?: string) => new RegistryTag<EntityTypeRef>(
            'entity_type', values, config.namespace, name),
        item: (values: readonly Exclude<ItemRef, '*'>[], name?: string) => new RegistryTag<Exclude<ItemRef, '*'>>(
            'item', values, config.namespace, name),
        block: (values: readonly BlockRef[], name?: string) => new RegistryTag<BlockRef>(
            'block', values, config.namespace, name),
        function: (values: readonly FunctionTag[], name?: string) => new FunctionTag(
            values, config.namespace, name
        )
    },
    _create () {
        fs.mkdirSync(config.resourcepack.outdir ,{
            recursive: true
        })
        fs.writeFileSync(`${config.resourcepack.outdir}/pack.mcmeta`, object_to_json(config.resourcepack.mcmeta))

        if (config.datapack.icon)
            fs.copyFileSync(
                config.datapack.icon,
                `${config.datapack.outdir}/${config.datapack.icon.split(/[\\/]/).pop()}`
            );

        // create datapack files
        Object.values(registry_tags).forEach(tag=>{
            tag._create()
        })

        Object.values(registries).forEach(registry=>{
            registry._create()
        })

        Object.values(functions).forEach(fn=>{
            fn._create()
        })
    }
}


export const resourcepack = {
    model(data: object, name?: string) {
        return new Model(data, name)
    },
    item(data: object, name?: string) {
        return new ItemModel(data, name)
    },
    equipment(data: object, name?: string) {
        return new Equipment(data, name)
    },
    _create() {
        fs.mkdirSync(config.resourcepack.outdir ,{
            recursive: true
        })
        fs.writeFileSync(`${config.resourcepack.outdir}/pack.mcmeta`, object_to_json(config.resourcepack.mcmeta))

        if (config.resourcepack.icon)
            fs.copyFileSync(
                config.resourcepack.icon,
                `${config.resourcepack.outdir}/${config.resourcepack.icon.split(/[\\/]/).pop()}`
            );

        Object.values(item_models).forEach(t => t._create())
        Object.values(textures).forEach(t => t._create())
        Object.values(models).forEach(t => t._create())
        Object.values(equipments).forEach(t => t._create())
    },
    texture: {
        item(path: string, name?: string) {
            return new ItemTexture(path, name)
        },
        equipment(type: 'humanoid' | 'humanoid_leggings' | 'wings', path: string, name?: string) {
            return new EquipmentTexture(type, path, name)
        }
    }
}

process.on('exit', ()=>{
    try {
        minecraft._create()
        datapack._create()
        resourcepack._create()
    } catch(e) {
        console.log(e)
    }
})