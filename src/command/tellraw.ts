// http://minecraft.fandom.com/wiki/Commands/title
import { TARGET } from "../arg/selector";
import { raw } from "./raw";
import { NBTText } from "../arg/nbt";

export function tellraw(target: TARGET, message: NBTText) {
    raw(`tellraw ${target} ${message}`)
}