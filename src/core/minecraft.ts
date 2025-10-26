
import { MCFunction, functions } from "../command/function"
import { config } from "../config";
import fs from 'fs'
import { objectives } from "../command/scoreboard/objective";
import { LootTable, registries, Registry } from "./registry";
import { bossbars } from "../command/bossbar";
import { teams } from "../command/team";
import { FunctionTag, registry_tags } from './tag';


let tick: MCFunction | undefined;
let load: MCFunction | undefined;

if(config.mcmeta.pack.pack_format !== 88) {
    throw new Error(`The pack format ${config.mcmeta.pack.pack_format} is not supported.`)
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

process.on('exit', ()=>{
    fs.mkdirSync(config.outdir ,{
        recursive: true
    })
    fs.writeFileSync(`${config.outdir}/pack.mcmeta`, JSON.stringify(config.mcmeta))
    
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

    Object.values(registry_tags).forEach(tag=>{
        tag._create()
    })

    Object.values(registries).forEach(registry=>{
        registry._create()
    })

    Object.values(functions).forEach(fn=>{
        fn._create()
    })

})