
import { MCFunction, functions } from "../command/function"
import { config } from "../config";
import fs from 'fs'
import { objectives } from "../command/scoreboard/objective";
import { datapack, LootTable, registries, Registry } from "./registry";
import { bossbars } from "../command/bossbar";
import { teams } from "../command/team";
import { FunctionTag, registry_tags } from './tag';
import { resourcepack } from "../asset";
import { object_to_string } from "../type";

let tick: MCFunction | undefined;
let load: MCFunction | undefined;

if(config.datapack.mcmeta.pack.pack_format !== 88) {
    throw new Error(`The pack format ${config.datapack.mcmeta.pack.pack_format} of datapack is not supported.`)
}

if(config.resourcepack.mcmeta.pack.pack_format !== 69) {
    throw new Error(`The pack format ${config.datapack.mcmeta.pack.pack_format} of resoucepack is not supported.`)
}

export const minecraft = {
    tick(fn: ()=>void) {
        if(tick)
            throw new Error('Duplicated tick function defined.')
        tick = new MCFunction(fn)
    },
    load(fn: ()=>void) {
        if(load)
            throw new Error('Duplicated load function defined.')
        load = new MCFunction(fn)
    },
}

function emit() {
    // build the AST tree root
    if(load || Object.keys(objectives).length)
        new FunctionTag([
            new MCFunction(()=>{
                Object.values(objectives).forEach(obj=>obj._create())
                Object.values(bossbars).forEach(obj=>obj._create())
                Object.values(teams).forEach(obj=>obj._create())
                load?.call()
            })
        ] , 'minecraft','load')._create()

    if(tick){
        new FunctionTag([
            tick
        ], 'minecraft', 'tick')._create()
    }
    
    // create datapack folder
    fs.mkdirSync(config.datapack.outdir ,{
        recursive: true
    })
    fs.writeFileSync(`${config.datapack.outdir}/pack.mcmeta`, object_to_string(config.datapack.mcmeta))

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
    
    // create resoucepack
    resourcepack._create()
}

process.on('exit', ()=>{
    try {
        emit()
    } catch(e) {
        console.log(e)
    }
})