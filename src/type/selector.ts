// https://minecraft.wiki/w/Target_selectors
// https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/execute?variant=zh-tw

import { ObjectiveMatches } from "../command/scoreboard/objective"
import { EntityTag } from "../command/tag"
import { ENTITY_TYPE } from "../core/tag"
import { Bound } from "./bound"
import { NBTCompound, NBTBase } from "./nbt"
import { Team } from "../command/team"

export type SELECTORS = '@s' | '@r' | '@p' | '@a' | '@e' | '@n'

interface SelectFilter {
    type?: ENTITY_TYPE
    distance?: {lower?: number, upper?: number},
    scores?: ObjectiveMatches[]
    tags?: EntityTag[]
    excl_tags?: EntityTag[]
    limit?: number
    sort?: 'arbitrary' | 'furthest' | 'nearest' | 'random'
    nbt?: NBTCompound<Record<string, NBTBase>>
    excl_nbt?: NBTCompound<Record<string, NBTBase>>
    team?: Team,
    excl_teams?: Team[],
    x?: number,
    y?: number,
    z?: number
    dx?: number,
    dy?: number,
    dz?: number
}

export class Selector {
    private target: SELECTORS
    private filter?: SelectFilter
    constructor(selector: SELECTORS, filter?: SelectFilter) {
        this.target = selector
        if(filter)
            this.filter = filter
    }
    public toString() {
        if(!this.filter)
            return this.target
        let filters: string[] = []
        let temp = this.filter.tags?.map(t=>`tag=${t}`).join(',')
        if(temp)
            filters.push(temp)

        temp = this.filter.excl_tags?.map(t=>`tag=!${t}`).join(',')
        if(temp)
            filters.push(temp)

        temp = this.filter.scores?.map(s=>`${s.objective}=${s.bound}`).join(',')
        if(temp)
            filters.push(`scores={${temp}}`)
        
        if(this.filter.distance)
            filters.push(`distance=${new Bound(this.filter.distance)}`)

        if(this.filter.limit)
            filters.push(`limit=${this.filter.limit}`)
        
        if(this.filter.sort)
            filters.push(`sort=${this.filter.sort}`)
        
        if(this.filter.nbt)
            filters.push(`nbt=${this.filter.nbt}`)
        
        if(this.filter.excl_nbt)
            filters.push(`nbt=!${this.filter.excl_nbt}`)
        
        if(this.filter.dx)
            filters.push(`dx=${this.filter.dx}`)
        
        if(this.filter.dy)
            filters.push(`dy=${this.filter.dy}`)
        
        if(this.filter.dz)
            filters.push(`dz=${this.filter.dz}`)
        
        if(this.filter.x)
            filters.push(`x=${this.filter.x}`)
        
        if(this.filter.y)
            filters.push(`y=${this.filter.y}`)
        
        if(this.filter.z)
            filters.push(`z=${this.filter.z}`)
        
        if(this.filter.type)
            filters.push(`type=${this.filter.type}`)
        
        return `${this.target}[${filters.join(',')}]`
    }
}

export type TARGET = Selector | string

export function sel(selector: SELECTORS, filter?: SelectFilter) {
    return new Selector(selector, filter)
}
