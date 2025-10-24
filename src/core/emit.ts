
import { ItemTag, BlockTag, FunctionTag, EntityTypeTag, RegistryTag } from './tag'
import { MCFunction, functions } from "../command/function"
import { config } from "../config";
import fs from 'fs'
import { objectives } from "../command/scoreboard/objective";
import { registry } from "./registry";
import { bossbars } from "../command/bossbar";
import { teams } from "../command/team";


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
    }
}

process.on('exit', ()=>{
    fs.mkdirSync(config.outdir ,{
        recursive: true
    })
    fs.writeFileSync(`${config.outdir}/pack.mcmeta`, JSON.stringify(config.mcmeta))

    class MCFunctionTag extends RegistryTag<MCFunction> {
        constructor(values: MCFunction[], name: string) {
            super('function', {}, values, 'minecraft', name)
        }
    }
    
    if(load || Object.keys(objectives).length)
        new MCFunctionTag([
            new MCFunction(()=>{
                Object.values(objectives).forEach(obj=>obj._create())
                Object.values(bossbars).forEach(obj=>obj._create())
                Object.values(teams).forEach(obj=>obj._create())
                load?.call()
            })
        ] ,'load')._create()

    if(tick){
        new MCFunctionTag([
            tick
        ], 'tick')._create()
    }

    EntityTypeTag._create()
    FunctionTag._create()
    BlockTag._create()
    ItemTag._create()

    Object.values(registry).forEach(record=>{
        Object.values(record).forEach(reg=>{
            reg._create()
        })
    })

    Object.values(functions).forEach(fn=>{
        fn._create()
    })

})