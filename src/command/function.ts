import { config } from "../config";
import fs from 'fs'
import { Command } from "../core/scope";
import { Scope } from '../core/scope'

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
        let dir = `${config.outdir}/data/${config.namespace}/function`
        fs.mkdirSync(dir, {
            recursive: true
        })
        const content = this.commands.join('\n') + '\n';
        fs.writeFileSync(`${dir}/${this.name}.mcfunction`, content);
    }
    call() {
        new Call(this)
    }
}


class Call extends Command {
    private fn: MCFunction;
    constructor (fn: MCFunction) {
        super()
        this.fn = fn;
    }
    public toString(): string {
        return `function ${this.fn}`
    }
}

export function mcfn(fn: ()=>void) {
    let mf = new MCFunction(fn)
    let fn_call = mf.call.bind(mf)
    return Object.assign(fn_call, mf)
}
