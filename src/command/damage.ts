import { Command } from "@/core/scope";
import { DAMAGE_TYPES } from "@/enum";
import { TARGET } from "@/type/selector";


class Damage extends Command {
    constructor(private target: TARGET, private amound: number, private tp?: DAMAGE_TYPES) {
        super()
    }
    public toString(): string {
        if(this.tp)
            return `damage ${this.target} ${this.amound} ${this.tp}`
         return `damage ${this.target} ${this.amound}`
    }
}

export function damage(target: TARGET, amound: number, tp?: DAMAGE_TYPES) {
    new Damage(target, amound, tp)
}