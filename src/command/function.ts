import { config } from "../config";
import fs from 'fs'
import { Scope } from '../core/scope'
import { FunctionTag } from "../core/tag";
import { TAG } from "../core/tag";
import { raw } from "./raw";

export const functions: Record<string, MCFunction> = {}

export class MCFunction extends Scope {
    private name: string;
    constructor(fn: () => void, name?: string) {
        super(fn)
        if(name) {
            if(name[0] === '_')
                throw new Error('Costom function name starting with _ is not allowed.')
            if(name in functions)
                throw new Error('Duplicated function name.')
            this.name = name
        }
        else
            this.name = `_${Object.keys(functions).length}`;
        functions[this.name] = this // record first, or the id of cuntion won't update
    }

    toString() {
        return `${config.namespace}:${this.name}`
    }

    _create() {
        let dir = `${config.datapack.outdir}/data/${config.namespace}/function`
        fs.mkdirSync(dir, {
            recursive: true
        })
        const content = this.commands.join('\n') + '\n';
        fs.writeFileSync(`${dir}/${this.name}.mcfunction`, content);
    }
    call() {
        raw(`function ${this}`)
    }
}

export function mcfn(fn: (()=>void), name?: string): MCFunction & (() => void)
export function mcfn(fn: TAG<MCFunction>[], name?: string): FunctionTag & (() => void)
export function mcfn(fn: (()=>void) | TAG<MCFunction>[], name?: string) {
    if (fn instanceof Function) {
        return new MCFunction(fn, name)
    }
    return new FunctionTag(fn, config.namespace, name)
}
