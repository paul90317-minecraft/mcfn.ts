import { Command } from "../core/scope";
import { Vec3 } from "../arg/vec3";
import { TargetRef } from "../arg/selector";



class Kill extends Command {
    constructor(private t?: TargetRef) {
        super()
    }
    public toString(): string {
        if(this.t)
            return `kill ${this.t}`
        return `kill`
    }
}

export function kill(target: TargetRef) {
    new Kill(target)
}