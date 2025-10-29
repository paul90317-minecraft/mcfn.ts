import { DAMAGE_TYPES } from "../enum";
import { Coordinate } from "../type";
import { TARGET } from "../type/selector";
import { raw } from "./raw";

export function damage(target: TARGET, amound: number, type?: DAMAGE_TYPES, by?: TARGET, from?: TARGET) {
    if(from)
        return raw(`damage ${target} ${amound} ${type} by ${by} from ${from}`)
    if(by)
        return raw(`damage ${target} ${amound} ${type} by ${by}`)
    if(type)
        return raw(`damage ${target} ${amound} ${type}`)
     return raw(`damage ${target} ${amound}`)
}

export function damage_at(target: TARGET, amound: number, type?: DAMAGE_TYPES, at?: Coordinate) {
    if(at)
        return raw(`damage ${target} ${amound} ${type} at ${at}`)
    if(type)
        return raw(`damage ${target} ${amound} ${type}`)
     return raw(`damage ${target} ${amound}`)
}