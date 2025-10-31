// http://minecraft.fandom.com/wiki/Commands/title
import { TARGET } from "../type/selector";
import { raw } from "./raw";
import { NBTText } from "../type/nbt";

export function tellraw(target: TARGET, message: NBTText) {
    raw(`tellraw ${target} ${message}`)
}