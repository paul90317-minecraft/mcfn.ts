// https://minecraft.fandom.com/wiki/Scoreboard

import { ObjectiveCriterionID } from '../../mcmeta/command_argument_type/objective_criteria'
import { TARGET } from '../../arg/selector'
import { NumberRange } from '../../arg/range'
import { Command } from '../../core/scope'
import { Score } from './score'
import { config } from '../../config'

export const objectives: Record<string, Objective> = {}

export class ObjectiveMatches {
    public readonly objective: Objective
    public readonly bound: NumberRange
    constructor(objective: Objective, bound: NumberRange) {
        this.objective = objective
        this.bound = bound
    }
}

export class Objective {
    public readonly criteria: ObjectiveCriterionID
    private name_: string
    constructor (criteria: ObjectiveCriterionID = 'dummy', name?: string) {
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
        return new ObjectiveMatches(this, new NumberRange(bound))
    }
    public between(lower: number, upper: number) {
        return new ObjectiveMatches(this, new NumberRange({lower, upper}))
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


export function objective(criteria: ObjectiveCriterionID = 'dummy', name?: string) {
    return new Objective(criteria, name)
}
