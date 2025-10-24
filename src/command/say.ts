import { Command } from "@/core/scope";


export function say (message: string) {
    new Say(message)
}

class Say extends Command {
    private message: string
    constructor(message: string) {
        super()
        this.message = message
    }
    public toString(): string {
        return `say ${this.message}`
    }
}