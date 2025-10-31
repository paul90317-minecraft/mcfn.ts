// https://minecraft.fandom.com/wiki/Commands/team

// https://minecraft.wiki/w/Commands/tag

import { TARGET } from "../type/selector"
import { config } from "../config"
import { raw } from "./raw"
import { NBTText } from "../type/nbt"

export const teams: Record<string, Team> = {}

export class Team {
    private id: string
    private name?: string
    constructor(opt?: {name?: NBTText, id?:string}) {
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

    join(target: TARGET) {
        raw(`team join ${this} ${target}`)
    }

    leave(target: TARGET) {
        raw(`team leave ${this} ${target}`)
    }
    modify(mod: TEAM_MOD) {
        Object.entries(mod).forEach(([k,v])=>{
            raw(`team modify ${this} ${k} ${v}`)
        })
    }

    public toString(){
        return `${config.namespace}.${this.id}`
    }
}

type COLOR_CODES =
  | 'black'
  | 'dark_blue'
  | 'dark_green'
  | 'dark_aqua'
  | 'dark_red'
  | 'dark_purple'
  | 'gold'
  | 'gray'
  | 'dark_gray'
  | 'blue'
  | 'green'
  | 'aqua'
  | 'red'
  | 'light_purple'
  | 'yellow'
  | 'white'

  type VISIBLE = 'never' | 'hideForOtherTeams' | 'hideForOwnTeam' | 'always'
type TEAM_MOD = {
    displayName?: NBTText
    color?: COLOR_CODES,
    friendlyFire?: boolean,
    seeFriendlyInvisibles?: boolean,
    nametagVisibility?: VISIBLE
    deathMessageVisibility?: VISIBLE
    collisionRule?: 'always' | 'never' | 'pushOtherTeams' | 'pushOwnTeam'
    prefix?: NBTText,
    suffix?: NBTText
}

export function team(opt?: {name?: NBTText, id?:string}) {
    return new Team(opt)
}

