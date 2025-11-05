import { Command } from "../core/scope";
import { Vec3 } from "../arg/vec3";
import { TARGET } from "../arg/selector";



class Kill extends Command {
    constructor(private t?: TARGET) {
        super()
    }
    public toString(): string {
        if(this.t)
            return `kill ${this.t}`
        return `kill`
    }
}

export function kill(target: TARGET) {
    new Kill(target)
}