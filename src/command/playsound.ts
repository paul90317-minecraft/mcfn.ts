// https://minecraft.wiki/w/Commands/playsound

import { Command } from "../core/scope"; 
import { Vec3 } from "../arg/vec3";
import { TARGET } from "../arg/selector"; 
import { SoundEventID } from "../mcmeta"; // 引入使用者提供的 SOUND_EVENTS

/**
 * 定義 Minecraft Java Edition 的音效分類 (source)。
 * 該參數是 playsound <sound> 之後的可選參數 [2, 3]。
 */
export type SOUND_SOURCES = 
    'master' 
    | 'music' 
    | 'record' 
    | 'weather' 
    | 'block' 
    | 'hostile' 
    | 'neutral' 
    | 'player' 
    | 'ambient' 
    | 'voice' 
    | 'ui'; 

/**
 * 代表 Minecraft Java Edition 的 /playsound 指令。
 * 語法: playsound <sound> [<source>] [<targets>] [<pos>] [<volume>] [<pitch>] [<minimumVolume>] [3]
 */
class Playsound extends Command {

    /**
     * 建構 Playsound 類別。
     * @param sound 指定要播放的音效 (SOUND_EVENTS，應為 Sound Event ID) [1]。
     * @param source 可選，音效所屬的音樂分類 [2]。
     * @param targets 可選，指定哪些玩家會聽到音效 [2]。
     * @param pos 可選，播放音效的位置 [4]。
     * @param volume 可選，音效可以被聽到的距離（預設為 1）[4]。
     * @param pitch 可選，音效的音高和速度（必須介於 0.0 和 2.0 之間，包含）[5]。
     * @param minVolume 可選，目標在正常聽覺範圍外時的最小音量（必須介於 0.0 和 1.0 之間，包含）[6]。
     */
    constructor(
        private sound: SoundEventID, // 使用 SOUND_EVENTS 替代 string
        private source?: SOUND_SOURCES,
        private targets?: TARGET,
        private pos?: Vec3,
        private volume?: number,
        private pitch?: number,
        private minVolume?: number
    ) {
        super();
        // 額外檢查（源自來源的限制）：
        // <volume> 必須大於或等於 0.0 [5]。
        if(this.volume !== undefined && this.volume < 0)
            throw Error('Volumn must be no less than 0')
            
        // <pitch> 必須介於 0.0 和 2.0 之間 (包含) [5]。
        if(this.pitch !== undefined && (this.pitch < 0 || this.pitch > 2))
            throw Error('pitch must be within 0 and 2')

        // <minVolume> 必須介於 0.0 和 1.0 之間 (包含) [6]。
        if(this.minVolume !== undefined && (this.minVolume < 0 || this.minVolume > 1))
            throw Error('minVolume must be within 0 and 1')
    }

    public toString(): string {
        // 核心語法: playsound <sound>
        let command = `playsound ${this.sound}`;

        // [<source>] - 如果省略，Java Edition 預設為 master [2]
        if (this.source)
            command += ` ${this.source}`;

        // [<targets>]
        if (this.targets)
            command += ` ${this.targets}`;

        // [<pos>]
        if (this.pos)
            command += ` ${this.pos}`;

        // [<volume>]
        if (this.volume !== undefined) 
            command += ` ${this.volume}`;

        // [<pitch>]
        if (this.pitch !== undefined) 
            command += ` ${this.pitch}`;

        // [<minimumVolume>]
        if (this.minVolume !== undefined) 
            command += ` ${this.minVolume}`;

        return command;
    }
}

/**
 * 處理 /playsound 指令的函數重載。
 */

// 形式 1: 僅指定音效事件 ID
export function playsound(sound: SoundEventID): void;

// 形式 2: 指定音效事件 ID 和分類 (source)
export function playsound(sound: SoundEventID, source: SOUND_SOURCES): void;

// 形式 3: 指定音效事件 ID、分類和目標 (targets)
export function playsound(sound: SoundEventID, source: SOUND_SOURCES, targets: TARGET): void;

// 形式 4: 指定音效事件 ID、分類、目標和位置 (pos)
export function playsound(sound: SoundEventID, source: SOUND_SOURCES, targets: TARGET, pos: Vec3): void;

// 形式 5: 包含音量 (volume)
export function playsound(
    sound: SoundEventID, 
    source: SOUND_SOURCES, 
    targets: TARGET, 
    pos: Vec3, 
    volume: number
): void;

// 形式 6: 包含音高 (pitch)
export function playsound(
    sound: SoundEventID, 
    source: SOUND_SOURCES, 
    targets: TARGET, 
    pos: Vec3, 
    volume: number, 
    pitch: number
): void;

// 形式 7: 完整語法，包含最小音量 (minimumVolume)
export function playsound(
    sound: SoundEventID, 
    source: SOUND_SOURCES, 
    targets: TARGET, 
    pos: Vec3, 
    volume: number, 
    pitch: number, 
    minVolume: number
): void;


// 實現函數
export function playsound(
    a: SoundEventID, // 現在強型別為 SOUND_EVENTS
    b?: SOUND_SOURCES,
    c?: TARGET,
    d?: Vec3,
    e?: number,
    f?: number,
    g?: number
) {
    new Playsound(a, b, c, d, e, f, g);
}