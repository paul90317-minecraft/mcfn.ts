// https://minecraft.fandom.com/wiki/Commands/particle

import { Command } from "../core/scope";
import { PARTICLE_TYPES } from "../enum";
import { Coordinate } from "../type/coord";
import { TARGET } from "../type/selector";

/**
 * 代表 Minecraft Java Edition 的 /particle 指令。
 * JE 語法: particle <name> <pos> <delta> <speed> <count> [force|normal] [<viewers>]
 */
class Particle extends Command {
    /**
     * 建構 PARTICLE 類別，使用複雜語法 (Complex Syntax)。
     * @param name 指定要創建的粒子 (resource location) [2]。
     * @param pos 粒子生成的位置 (vec3) [3]。
     * @param delta 粒子生成立體空間的大小 (vec3)，也可能用於 RGB 或運動值 [3]。
     * @param speed 粒子的速度 (float)，必須大於或等於 0.0 [4]。
     * @param count 粒子效果的數量 (integer)，0 表示單個粒子 [4]。
     * @param mode 顯示模式：'normal' (32格範圍) 或 'force' (512格範圍) [5]。
     * @param viewers 可選，指定哪些玩家能看到粒子 [5]。
     */
    constructor(
        private name: PARTICLE_TYPES,
        private pos?: Coordinate,
        private delta?: Coordinate,
        private speed?: number,
        private count?: number,
        private mode?: 'force' | 'normal',
        private viewers?: TARGET
    ) {
        super();
    }
    
    public toString(): string {
        // 核心語法: particle <name> <pos> <delta> <speed> <count> [1]
        let command = `particle ${this.name}`;
        if (this.pos !== undefined)
            command += ` ${this.pos}`
        if (this.delta !== undefined)
            command += ` ${this.delta}`
        if (this.speed !== undefined)
            command += ` ${this.speed}`
        if (this.count !== undefined)
            command += ` ${this.count}`
        if (this.mode !== undefined)
            command += ` ${this.mode}`;
        if (this.viewers !== undefined)
            command += ` ${this.viewers}`;
        return command;
    }
}

/**
 * 處理 /particle 指令的函數重載。
 */
// 形式 1: 簡單語法 particle <name> [<pos>] [1]
export function particle(name: PARTICLE_TYPES, pos?: Coordinate): void;

// 形式 2: 完整複雜語法 particle <name> <pos> <delta> <speed> <count> [force|normal] [<viewers>] [1]
export function particle(
    name: PARTICLE_TYPES, 
    pos: Coordinate, 
    delta: Coordinate, 
    speed: number, 
    count: number, 
    mode?: 'force' | 'normal', 
    viewers?: TARGET
): void;

// 實現函數
export function particle(a: PARTICLE_TYPES, b?: Coordinate | Coordinate, c?: Coordinate, d?: number, e?: number, f?: 'force' | 'normal', g?: TARGET) {
    new Particle(a, b, c, d, e, f, g)
}