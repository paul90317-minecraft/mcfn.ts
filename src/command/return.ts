import { MCFunction } from "../file/function";
import { Command, InlineScope } from "../core/scope";

export function ret(code: (()=>void) | 'fail' | number, inline: boolean = false) {
    new Return(code, inline)
}

class Return extends Command {
    private code: Command | 'fail' | number
    constructor(code: (()=>void) | 'fail' | number, inline: boolean = false){
        super()
        if(code instanceof Function){
            if(inline)
                this.code = new InlineScope(code).get()
            else
                this.code = new InlineScope(()=>new MCFunction(code).call()).get()
            return
        }
        this.code = code
    }
    public toString(): string {
        if(this.code instanceof Command)
            return `return run ${this.code}`
        return `return ${this.code}`
    }
}
