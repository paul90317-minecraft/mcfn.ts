// https://minecraft.fandom.com/wiki/Commands/team

// https://minecraft.wiki/w/Commands/tag

import { TargetRef } from "../arg/selector"
import { config } from "../config"
import { raw } from "./raw"
import { NBTText, NBTTextRef } from "../arg/nbt"
import { ColorID } from "../mcmeta/command_argument_type"

export const teams: Record<string, Team> = {}

export class Team {
    private id: string
    private name?: string
    constructor(opt?: {name?: NBTTextRef, id?:string}) {
        const {id, name} = opt ?? {}
        if (id) {
            if (id[0] === "_")
                throw new Error("Custom tag starting with _ is not allowed.")
            if (id in teams)
                throw new Error("Duplicated tag declaration.")
            this.id = id
        } else {
            this.id = `_${Object.keys(teams).length}`
        }
        teams[this.id] = this
        if(name)
            this.name = "" + name
    }

    _create() {
        if(this.name)
            raw(`team add ${this} ${this.name}`)
        else
            raw(`team add ${this}`)
    }

    _remove() {
        raw(`team remove ${this}`)
    }

    empty() {
        raw(`team empty ${this}`)
    }

    join(target: TargetRef) {
        raw(`team join ${this} ${target}`)
    }

    leave(target: TargetRef) {
        raw(`team leave ${this} ${target}`)
    }
    modify(mod: TeamModObject) {
        Object.entries(mod).forEach(([k,v])=>{
            raw(`team modify ${this} ${k} ${v}`)
        })
    }

    public toString(){
        return `${config.namespace}.${this.id}`
    }
}

type VisibilityID = 'never' | 'hideForOtherTeams' | 'hideForOwnTeam' | 'always'
type TeamModObject = {
    displayName?: NBTText
    color?: ColorID,
    friendlyFire?: boolean,
    seeFriendlyInvisibles?: boolean,
    nametagVisibility?: VisibilityID
    deathMessageVisibility?: VisibilityID
    collisionRule?: 'always' | 'never' | 'pushOtherTeams' | 'pushOwnTeam'
    prefix?: NBTText,
    suffix?: NBTText
}

export function team(opt?: {name?: NBTText, id?:string}) {
    return new Team(opt)
}

