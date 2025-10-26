// https://minecraft.wiki/w/Target_selectors
// https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/execute?variant=zh-tw

import { TAG } from "../core/tag"
import { ObjectiveMatches } from "../command/scoreboard/objective"
import { EntityTag } from "../command/tag"
import { ENTITY_TYPE } from "../core/tag"
import { Bound } from "./bound"
import { NBTCompound, NBTBase } from "./nbt"

type SELECTORS = '@s' | '@r' | '@p' | '@a' | '@e' | '@n'

interface SelectFilter {
    types?: ENTITY_TYPE[]
    distance?: {lower?: number, upper?: number},
    scores?: ObjectiveMatches[]
    tags?: EntityTag[]
    excl_tags?: EntityTag[]
    limit?: number
    sort?: 'arbitrary' | 'furthest' | 'nearest' | 'random'
    nbt?: NBTCompound<Record<string, NBTBase>>
    excl_nbt?: NBTCompound<Record<string, NBTBase>>
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
        temp = this.filter.excl_tags?.map(t=>`tag=${t}`).join(',')
        if(temp)
            filters.push(temp)
        temp = this.filter.scores?.map(s=>`${s.objective}=${s.bound}`).join(',')
        if(temp)
            filters.push(`scores={${temp}}`)
        temp = this.filter.types?.map(t=>`type=${t}`).join(',')
        if(temp)
            filters.push(temp)
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
        return `${this.target}[${filters.join(',')}]`
    }
}

export type TARGET = Selector | string

export function sel(selector: SELECTORS, filter?: SelectFilter) {
    return new Selector(selector, filter)
}
