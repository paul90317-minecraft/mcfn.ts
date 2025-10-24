import { Objective } from "@/command/scoreboard/objective"
import { TARGET } from "../../type/selector"
import { Bound } from "../../type/bound"
import { Command } from "@/core/scope"
import { Condition } from "../execute"

type COMPARES = '>' | '<' | '=' | '>=' | '<='
type OPERATORS = '>' | '<' | '><' | '=' | '+=' | '-=' | '/=' | '*=' | '%='
type MODIFIERS = 'add' | 'remove' | 'set'

export class Score {
    private objective: Objective
    private target: TARGET
    constructor(objective: Objective, target: TARGET) {
        this.objective = objective
        this.target = target
    }
    public matches(bound: {lower?:number, upper?:number}) {
        return new ScoreMatches(this, new Bound(bound))
    }
    public between(lower: number, upper:number) {
        return new ScoreMatches(this, new Bound({lower, upper}))
    }
    public gt(score2: Score | number) {
        if(score2 instanceof Score)
            return new ScoreCompares(this, '>', score2)
        return new ScoreMatches(this, new Bound({lower: score2 + 1}))
    }
    public lt(score2: Score | number) {
        if(score2 instanceof Score)
            return new ScoreCompares(this, '<', score2)
        return new ScoreMatches(this, new Bound({upper: score2 - 1}))
    }
    public eq(score2: Score | number) {
        if(score2 instanceof Score)
            return new ScoreCompares(this, '=', score2)
        return new ScoreMatches(this, new Bound({upper: score2, lower: score2}))
    }
    public ge(score2: Score | number) {
        if(score2 instanceof Score)
            return new ScoreCompares(this, '>=', score2)
        return new ScoreMatches(this, new Bound({lower: score2}))
    }
    public le(score2: Score | number) {
        if(score2 instanceof Score)
            return new ScoreCompares(this, '<=', score2)
        return new ScoreMatches(this, new Bound({upper: score2}))
    }
    public addby(arg: Score | number) {
        if (arg instanceof Score)
            new ScoreOperation(this, "+=", arg)
        else
            new ScoreModifier(this, "add", arg)
    }
    public subby(arg: Score | number) {
        if (arg instanceof Score)
            new ScoreOperation(this, "-=", arg)
        else
            new ScoreModifier(this, "remove", arg)
    }
    public assign(arg: Score | number) {
        if (arg instanceof Score)
            new ScoreOperation(this, "=", arg)
        else
            new ScoreModifier(this, "set", arg)
    }
    public divby(arg: Score) {
        new ScoreOperation(this, "/=", arg)
    }
    public mulby(arg: Score) {
        new ScoreOperation(this, "*=", arg)
    }
    public modby(arg: Score) {
        new ScoreOperation(this, "%=", arg)
    }
    public min(arg: Score) {
        new ScoreOperation(this, "<", arg)
    }
    public max(arg: Score) {
        new ScoreOperation(this, ">", arg)
    }
    public swap(arg: Score) {
        new ScoreOperation(this, "><", arg)
    }
    public reset() {
        new ScoreReset(this)
    }
    public get() {
        new ScoreGet(this)
    }
    public toString(){
        return `${this.target} ${this.objective}`
    }
}

class ScoreCompares extends Condition {
    public readonly score: Score
    public readonly compare: COMPARES
    public readonly score2: Score
    constructor(score: Score, compare: COMPARES, score2: Score) {
        super()
        this.score = score
        this.compare = compare
        this.score2 = score2
    }
    toString() {
        return `score ${this.score} ${this.compare} ${this.score2}`
    }
}

class ScoreMatches extends Condition {
    public readonly score: Score
    public readonly bound: Bound
    constructor(score: Score, bound: Bound) {
        super()
        this.score = score
        this.bound = bound
    }
    toString() {
        return `score ${this.score} matches ${this.bound}`
    }
}

class ScoreOperation extends Command {
    private score: Score
    private op: OPERATORS
    private score2: Score
    constructor(score: Score, op: OPERATORS, score2: Score) {
        super()
        this.score = score
        this.op = op
        this.score2 = score2
    }
    public toString(): string {
        return `scoreboard players operation ${this.score} ${this.op} ${this.score2}`
    }
}

class ScoreModifier extends Command {
    private score: Score
    private op: MODIFIERS
    private value: number
    constructor(score: Score, op: MODIFIERS, value: number) {
        super()
        this.score = score
        this.op = op
        this.value = value
    }
    public toString(): string {
        return `scoreboard players ${this.op} ${this.score} ${this.value}`
    }
}

class ScoreReset extends Command {
    private score: Score
    constructor(score: Score) {
        super()
        this.score = score
    }
    public toString(): string {
        return `scoreboard players reset ${this.score}`
    }
}

class ScoreGet extends Command {
    private score: Score
    constructor(score: Score) {
        super()
        this.score = score
    }
    public toString(): string {
        return `scoreboard players get ${this.score}`
    }
}
