// https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/execute?variant=zh-tw

import { TARGET } from '../type/selector'
import { Command } from '../core/scope'
import { MCFunction } from './function';
import { Coordinate } from '../type/coord';
import { DIMENSIONS, ENTITY_TYPES } from '../enum';
import { InlineScope } from '../core/scope';
import { Predicate } from '../core/registry';
import { Data } from './data';
import { Score } from './scoreboard/score';
import { BossBar } from './bossbar';
import { Condition } from '../type/condition';

type IF_ARGS = Condition | Predicate | DIMENSIONS | Data | (()=>void) | MCFunction
class If {
    constructor(public readonly condition: IF_ARGS) {}
    public toString() {
        if(this.condition instanceof Condition)
            return `if ${this.condition}`;
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
    constructor(public readonly position: Coordinate) {}
    public toString() {
        return `positioned ${this.position}`;
    }
}

class Summon {
    constructor(public readonly entity: ENTITY_TYPES) {}
    public toString() {
        return `summon ${this.entity}`;
    }
}

class In {
    constructor(public readonly dim: DIMENSIONS) {}
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
type TYPES = 'byte' | 'double' | 'float' | 'int' | 'long' | 'short'
type BOSSATTR = 'max' | 'value'
class StoreData {
    constructor(
        private source: 'success' | 'result',
        private target: Data,
        private tp: TYPES
    ) {

    }
    public toString() {
        return `store ${this.source} ${this.target} ${this.tp}`
    }
}
class StoreScore {
    constructor(private source: 'success' | 'result', private target: Score) {

    }
    public toString() {
        return `store ${this.source} ${this.target}`
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
        return `store ${this.source} ${this.bar} ${this.attr}`
    }
}

class Control {
    private arguments: (If | Unless | As | At | Positioned | Summon | In | On | StoreData | StoreScore | StoreBossbar)[];
    public constructor() {
        this.arguments = [];
    }

    public store(
        source: 'success' | 'result',
        target: Data,
        tp: TYPES
    ): this
    public store(source: 'success' | 'result', target: Score): this
    public store(
        source: 'success' | 'result', 
        id: BossBar, 
        where: BOSSATTR
    ): this
    public store(
        source: 'success' | 'result',
        target: Data | Score | BossBar,
        opt?: BOSSATTR | TYPES
    ) {
        if(target instanceof Data)
            this.arguments.push(new StoreData(source, target, opt as TYPES))
        else if(target instanceof Score)
            this.arguments.push(new StoreScore(source, target))
        else 
            this.arguments.push(new StoreBossbar(source, target, opt as BOSSATTR))
        return this
    }

    public as(entity: TARGET) {
        this.arguments.push(new As(entity))
        return this
    }
    
    public at(entity: TARGET) {
        this.arguments.push(new At(entity))
        return this
    }
    public if (condition: Condition) {
        this.arguments.push(new If(condition))
        return this
    }

    public unless(condition: IF_ARGS) {
        this.arguments.push(new Unless(condition))
        return this
    }
    public positioned(position: Coordinate) {
        this.arguments.push(new Positioned(position))
        return this
    }
    public summon(entity: ENTITY_TYPES) {
        this.arguments.push(new Summon(entity))
        return this
    }
    public in(dim: DIMENSIONS) {
        this.arguments.push(new In(dim))
        return this
    }
    public on (rel: RELATION) {
        this.arguments.push(new On(rel))
    }
    
    public run(fn: MCFunction): void
    public run(fn: ()=>void, inline: boolean): void
    public run(fn: (()=>void) | MCFunction, inline = false) {
        new Execute(this, fn, inline)
    }
    public toString() {
        return this.arguments.join(' ')
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

function store(source: 'success' | 'result', target: Score): Control
function store(
    source: 'success' | 'result',
    target: Data,
    tp: TYPES
): Control
function store(
    source: 'success' | 'result', 
    id: BossBar, 
    where: BOSSATTR
): Control
function store(
    source: 'success' | 'result',
    target: Data | Score | BossBar,
    opt?: BOSSATTR | TYPES
) {
    return new Control().store(source, target as Data, opt as TYPES)
}

export const execute = {
    as: (entity: TARGET) => new Control().as(entity),
    at: (entity: TARGET) => new Control().at(entity),
    if: (condition: IF_ARGS) => new Control().if(condition),
    unless: (condition: IF_ARGS) => new Control().unless(condition),
    positioned: (position: Coordinate) => new Control().positioned(position),
    summon: (entity: ENTITY_TYPES) => new Control().summon(entity),
    in: (dim: DIMENSIONS) => new Control().in(dim),
    on: (rel: RELATION) => new Control().on(rel),
    store
}