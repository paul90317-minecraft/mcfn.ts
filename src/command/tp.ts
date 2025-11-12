import { Command } from "../core/scope";
import { Vec3 } from "../arg/vec3";
import { TargetRef } from "../arg/selector";



class TP extends Command {
    private src?: TargetRef
    private dst: TargetRef | Vec3
    constructor(a: TargetRef | Vec3, b?: TargetRef | Vec3) {
        super()
        if(b) {
            this.src = a as TargetRef
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

export function tp(dst: TargetRef | Vec3): void
export function tp(src: TargetRef, dst: TargetRef | Vec3): void
export function tp(a: TargetRef | Vec3, b?: TargetRef | Vec3) {
    new TP(a, b)
}