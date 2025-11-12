// http://minecraft.fandom.com/wiki/Commands/title
import { TargetRef } from "../arg/selector";
import { raw } from "./raw";
import { NBTText } from "../arg/nbt";

export function tellraw(target: TargetRef, message: NBTText) {
    raw(`tellraw ${target} ${message}`)
}