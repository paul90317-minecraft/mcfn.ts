// https://minecraft.fandom.com/wiki/Scoreboard

import { OBJECTIVE_CRITERION } from '../../enum/criterion'
import { TARGET } from '../../type/selector'
import { Bound } from '../../type/bound'
import { Command } from '../../core/scope'
import { Score } from './score'
import { config } from '../../config'

export const objectives: Record<string, Objective> = {}

export class ObjectiveMatches {
    public readonly objective: Objective
    public readonly bound: Bound
    constructor(objective: Objective, bound: Bound) {
        this.objective = objective
        this.bound = bound
    }
}

export class Objective {
    public readonly criteria: OBJECTIVE_CRITERION
    private name_: string
    constructor (criteria: OBJECTIVE_CRITERION = 'dummy', name?: string) {
        this.criteria = criteria
        if(name) {
            this.name_ = name
            if(name[0] === '_')
                throw new Error('Costom objective name starting with _ is not allowed.')
            if(name in objectives)
                throw new Error('Duplicated objective name.')
        } else 
            this.name_ = `_${Object.keys(objectives).length}`
        objectives[this.name_] = this

    }
    public get(target: TARGET) {
        return new Score(this, target)
    }
    public matches(bound: {lower?: number, upper?: number}) {
        return new ObjectiveMatches(this, new Bound(bound))
    }
    public between(lower: number, upper: number) {
        return new ObjectiveMatches(this, new Bound({lower, upper}))
    }
    public lt(x: number) {
        return new ObjectiveMatches(this, {upper: x - 1})
    }
    public gt(x: number) {
        return new ObjectiveMatches(this, {lower: x + 1})
    }
    public eq(x: number) {
        return new ObjectiveMatches(this, {lower: x, upper: x})
    }
    public le(x: number) {
        return new ObjectiveMatches(this, {upper: x})
    }
    public ge(x: number) {
        return new ObjectiveMatches(this, {lower: x})
    }
    public toString() {
        return `${config.namespace}.${this.name_}`
    }
    public _create() {
        new CreateObjective(this)
    }
}

class CreateObjective extends Command {
    public objective: Objective
    constructor(objective: Objective) {
        super()
        this.objective = objective
    }
    public toString(): string {
        return `scoreboard objectives add ${this.objective} ${this.objective.criteria}`
    }
} 


export function objective(criteria: OBJECTIVE_CRITERION = 'dummy', name?: string) {
    let o = new Objective(criteria, name)
    let fn = o.get.bind(o) 
    return Object.assign(fn, o)
}
