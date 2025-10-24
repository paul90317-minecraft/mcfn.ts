import { Command } from "@/core/scope";
import { Coordinate } from "@/type/coord";
import { TARGET } from "@/type/selector";



class TP extends Command {
    private src?: TARGET
    private dst: TARGET | Coordinate
    constructor(a: TARGET | Coordinate, b?: TARGET | Coordinate) {
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

export function tp(dst: TARGET | Coordinate): void
export function tp(src: TARGET, dst: TARGET | Coordinate): void
export function tp(a: TARGET | Coordinate, b?: TARGET | Coordinate) {
    new TP(a, b)
}