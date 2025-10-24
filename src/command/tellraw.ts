// http://minecraft.fandom.com/wiki/Commands/title
import { TARGET } from "../type/selector";
import { raw } from "./raw";
import { Text } from "../type/nbt";

export function tellraw(target: TARGET, message: Text | Text[]) {
    raw(`tellraw ${target} ${message}`)
}