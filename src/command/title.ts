// https://minecraft.fandom.com/wiki/Commands/title

import { TARGET } from "../type/selector";
import { raw } from './raw'
import { Text } from "../type/nbt";

export function title(target: TARGET) {
    return {
        clear: () => raw(`title ${target} clear`),
        reset: () => raw(`title ${target} reset`),
        times: (fadeIn: number, stay: number, fadeOut: number) => raw(`title ${target} times ${fadeIn} ${stay} ${fadeOut}`),
        title: (text: Text | Text[]) => raw(`title ${target} title ${text}`),
        subtitle: (text: Text | Text[]) => raw(`title ${target} subtitle ${text}`),
        actionbar: (text: Text | Text[]) => raw(`title ${target} actionbar ${text}`),
    }
}
