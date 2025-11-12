import { Command } from "../core/scope";
import { TargetRef } from "../arg/selector";
import { MobEffectID } from "../mcmeta";

type EffectDuration = number | 'infinite';

class Effect extends Command {
    constructor(
        private targets: TargetRef,
        private action: 'give' | 'clear',
        private effect?: MobEffectID,
        private duration?: EffectDuration,
        private amplifier?: number,
        private hideParticles?: boolean
    ) {
        super();
        if (this.action === 'give') {
            if (!this.effect) throw new Error('Effect type is required for "give" action.');
            if (typeof this.duration === 'number' && (this.duration < 0 || this.duration > 1000000))
                throw new Error('Duration must be between 0 and 1000000 (inclusive).');
            if (this.amplifier !== undefined && (this.amplifier < 0 || this.amplifier > 255))
                throw new Error('Amplifier must be between 0 and 255 (inclusive).');
        }
    }

    public toString(): string {
        let command = `effect ${this.action} ${this.targets}`;
        if (this.action === 'clear') {
            if (this.effect) command += ` ${this.effect}`;
        } else if (this.action === 'give') {
            command += ` ${this.effect}`;
            if (this.duration !== undefined)
                command += this.duration === 'infinite' ? ` infinite` : ` ${this.duration}`;
            if (this.amplifier !== undefined) command += ` ${this.amplifier}`;
            if (this.hideParticles !== undefined) command += ` ${this.hideParticles}`;
        }
        return command;
    }
}

export const effect = {
    give: (
        targets: TargetRef,
        effect?: MobEffectID,
        seconds?: EffectDuration,
        amplifier?: number,
        hideParticles?: boolean
    ) => new Effect(targets, 'give', effect, seconds, amplifier, hideParticles),
    clear: (
        targets: TargetRef,
        effect?: MobEffectID,
    ) => new Effect(targets, 'clear', effect)
}
