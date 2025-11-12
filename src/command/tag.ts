// https://minecraft.wiki/w/Commands/tag

import { TargetRef } from "../arg/selector"
import { Command } from "../core/scope"
import { config } from "../config"

const tags: Set<string> = new Set()

class EntityTagCommand extends Command {
    public readonly target: TargetRef
    public readonly tag: EntityTag
    public readonly action: "add" | "remove"

    constructor(target: TargetRef, tag: EntityTag, action: "add" | "remove") {
        super()
        this.target = target
        this.tag = tag
        this.action = action
    }

    public toString(): string {
        return `tag ${this.target} ${this.action} ${this.tag}`
    }
}

export class EntityTag {
    private name: string
    constructor(name?: string) {
        if (name) {
            if (name[0] === "_")
                throw new Error("Custom tag starting with _ is not allowed.")
            if (tags.has(name))
                throw new Error("Duplicated tag declaration.")
            this.name = name
        } else {
            this.name = `_${tags.size}`
        }

        tags.add(this.name)
    }

    public add(selector: TargetRef) {
        return new EntityTagCommand(selector, this, "add")
    }

    public remove(selector: TargetRef) {
        return new EntityTagCommand(selector, this, "remove")
    }
    public toString(){
        return `${config.namespace}.${this.name}`
    }
}

export function tag(name?: string) {
    return new EntityTag(name)
}
