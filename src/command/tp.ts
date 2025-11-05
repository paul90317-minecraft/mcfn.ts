import { Command } from "../core/scope";
import { Vec3 } from "../arg/vec3";
import { TARGET } from "../arg/selector";



class TP extends Command {
    private src?: TARGET
    private dst: TARGET | Vec3
    constructor(a: TARGET | Vec3, b?: TARGET | Vec3) {
        super()
        if(b) {
            this.src = a as TARGET
            this.dst = b
        } else {
            this.dst = a
        }
    }
    public toString(): string {
        if(this.src)
            return `tp ${this.src} ${this.dst}`
        return `tp ${this.dst}`
    }
}

export function tp(dst: TARGET | Vec3): void
export function tp(src: TARGET, dst: TARGET | Vec3): void
export function tp(a: TARGET | Vec3, b?: TARGET | Vec3) {
    new TP(a, b)
}