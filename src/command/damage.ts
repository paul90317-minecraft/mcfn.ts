import { DamageTypeId } from "../mcmeta";
import { Vec3 } from "../arg";
import { TARGET } from "../arg/selector";
import { raw } from "./raw";

export function damage(target: TARGET, amound: number, type?: DamageTypeId, by?: TARGET, from?: TARGET) {
    if(from)
        return raw(`damage ${target} ${amound} ${type} by ${by} from ${from}`)
    if(by)
        return raw(`damage ${target} ${amound} ${type} by ${by}`)
    if(type)
        return raw(`damage ${target} ${amound} ${type}`)
     return raw(`damage ${target} ${amound}`)
}

export function damage_at(target: TARGET, amound: number, type?: DamageTypeId, at?: Vec3) {
    if(at)
        return raw(`damage ${target} ${amound} ${type} at ${at}`)
    if(type)
        return raw(`damage ${target} ${amound} ${type}`)
     return raw(`damage ${target} ${amound}`)
}