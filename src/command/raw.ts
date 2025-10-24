import { Command } from "../core/scope";

class Raw extends Command {
    constructor(private cmd: string) {super()}
    public toString(): string {
        return this.cmd
    }
}

export function raw(cmd: string) {
    new Raw(cmd)
}