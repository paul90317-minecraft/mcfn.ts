import { Command } from "../core/scope";
import { Coordinate } from "../type/coord";
import { TARGET } from "../type/selector";



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