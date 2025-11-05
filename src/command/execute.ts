// https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/execute?variant=zh-tw

import { Selector, TARGET } from '../arg/selector'
import { Command } from '../core/scope'
import { MCFunction } from './function';
import { Vec3 } from '../arg/vec3';
import { DimensionID, EntityTypeID } from '../mcmeta';
import { InlineScope } from '../core/scope';
import { Predicate } from '../core/registry';
import { Data } from './data';
import { Score } from './scoreboard/score';
import { BossBar } from './bossbar';
import { Condition } from '../arg/condition';

type IF_ARGS = Condition | Predicate | DimensionID | Data | (()=>void) | MCFunction | Selector
class If {
    constructor(public readonly condition: IF_ARGS) {}
    public toString() {
        if(this.condition instanceof Condition)
            return `if ${this.condition}`;
        if(this.condition instanceof Selector)
            return `if entity ${this.condition}`;
        if(this.condition instanceof Predicate)
            return `if predicate ${this.condition}`
        if (this.condition instanceof Data)
            return `if data ${this.condition}`
        if (this.condition instanceof Function)
            return `if function ${new MCFunction(this.condition)}`
        if (this.condition instanceof MCFunction)
            return `if function ${this.condition}`
        return `if in ${this.condition}`
    }
}

class Unless extends If {
    constructor(public readonly condition: IF_ARGS) {super(condition)}
    public toString() {
        return 'unless' + super.toString().substring(2)
    }
}

class As {
    constructor(public readonly entity: TARGET) {}
    public toString() {
        return `as ${this.entity}`;
    }
}

class At {
    constructor(public readonly entity: TARGET) {}
    public toString() {
        return `at ${this.entity}`;
    }
}

class Positioned {
    constructor(public readonly position: Vec3) {}
    public toString() {
        return `positioned ${this.position}`;
    }
}

class Summon {
    constructor(public readonly entity: EntityTypeID) {}
    public toString() {
        return `summon ${this.entity}`;
    }
}

class In {
    constructor(public readonly dim: DimensionID) {}
    public toString() {
        return `in ${this.dim}`;
    }
}
type RELATION = 'attacker' | 'controller' | 'leasher' | 'origin' | 'owner' | 'passengers' | 'target' | 'vehicle'

class On {
    constructor(public readonly rel: RELATION) {}
    public toString() {
        return `on ${this.rel}`;
    }
}
type DATA_TYPES = 'byte' | 'double' | 'float' | 'int' | 'long' | 'short'
type BOSSATTR = 'max' | 'value'
class StoreData {
    constructor(
        private source: 'success' | 'result',
        private target: Data,
        private type: DATA_TYPES,
        private scale: number
    ) {

    }
    public toString() {
        return `store ${this.source} ${this.target} ${this.type} ${this.scale}`
    }
}
class StoreScore {
    constructor(private source: 'success' | 'result', private target: Score) {

    }
    public toString() {
        return `store ${this.source} score ${this.target}`
    }
}

class StoreBossbar {
    constructor(
        private source: 'success' | 'result', 
        private bar: BossBar, 
        private attr: BOSSATTR
    ) {

    }
    public toString() {
        return `store ${this.source} bossbar ${this.bar} ${this.attr}`
    }
}

class Control {
    private readonly args: (
        If | Unless | As | At | Positioned | Summon | In | On | StoreData | StoreScore | StoreBossbar
    )[];

    constructor(args: Control["args"] = []) {
        this.args = [...args];
    }

    /** Immutable push helper */
    private next(arg: Control["args"][number]): Control {
        return new Control([...this.args, arg]);
    }

    public store(source: 'success' | 'result') {
        return {
            data: (target: Data, type: DATA_TYPES, scale: number) =>
                this.next(new StoreData(source, target, type, scale)),
            score: (score: Score) =>
                this.next(new StoreScore(source, score)),
            bossbar: (bossbar: BossBar, attr: 'max' | 'value') =>
                this.next(new StoreBossbar(source, bossbar, attr))
        };
    }

    public as(entity: TARGET) {
        return this.next(new As(entity));
    }

    public at(entity: TARGET) {
        return this.next(new At(entity));
    }

    public if(condition: IF_ARGS) {
        return this.next(new If(condition));
    }

    public unless(condition: IF_ARGS) {
        return this.next(new Unless(condition));
    }

    public positioned(position: Vec3) {
        return this.next(new Positioned(position));
    }

    public summon(entity: EntityTypeID) {
        return this.next(new Summon(entity));
    }

    public in(dim: DimensionID) {
        return this.next(new In(dim));
    }

    public on(rel: RELATION) {
        return this.next(new On(rel));
    }

    public run(fn: MCFunction): void;
    public run(fn: () => void, inline?: boolean): void;
    public run(fn: (() => void) | MCFunction, inline = false) {
        new Execute(this, fn, inline);
    }

    public toString() {
        return this.args.join(' ');
    }
}

class Execute extends Command {
    public readonly control: Control
    public readonly cmd: Command
    constructor(control: Control, fn: (() => void) | MCFunction, inline: boolean) {
        super()
        this.control = control
        if(fn instanceof MCFunction) {
            this.cmd = new InlineScope(()=>fn.call())
            return
        }
        if(inline) {
            this.cmd = new InlineScope(fn).get()
            return;
        }
        this.cmd = new InlineScope(()=>new MCFunction(fn).call()).get()
    }
    toString() {
        return `execute ${this.control} run ${this.cmd}`
        
    }
}

export const execute = {
    as: (entity: TARGET) => new Control().as(entity),
    at: (entity: TARGET) => new Control().at(entity),
    if: (condition: IF_ARGS) => new Control().if(condition),
    unless: (condition: IF_ARGS) => new Control().unless(condition),
    positioned: (position: Vec3) => new Control().positioned(position),
    summon: (entity: EntityTypeID) => new Control().summon(entity),
    in: (dim: DimensionID) => new Control().in(dim),
    on: (rel: RELATION) => new Control().on(rel),
    store: (source: 'result' | 'success') => new Control().store(source)
}