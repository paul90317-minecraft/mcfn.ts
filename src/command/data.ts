import { Command } from "../core/scope"
import { Coordinate } from "../type/coord"
import { NBTBase } from "../type/nbt"
import { TARGET } from "../type/selector"
import { config } from "../config"

export abstract class Data {
    protected paths: string[]
    constructor() {
        this.paths = []
    }
    public at(key: string | NBTBase) {
        if(key instanceof NBTBase) {
            this.paths.push(`[${key}]`)
            return this
        }

        if(!/^[A-Za-z0-9_]+$/.test(key))
            throw new Error('Wrong format of data path.')
        this.paths.push(key)
        return this
    }
    public merge(source: Data | NBTBase) {
        return new DataModify('merge', this, source)
    }
    public set(source: Data | NBTBase) {
        return new DataModify('set', this, source)
    }
    public append(source: Data | NBTBase) {
        return new DataModify('append', this, source)
    }
    public prepend(source: Data | NBTBase) {
        return new DataModify('prepend', this, source)
    }
    public insert(source: Data | NBTBase, index: number) {
        return new DataModify('insert', this, source, index)
    }
    public remove() {
        return new DataModify('remove', this)
    }
    public get() {
        return new DataModify('get', this)
    }
    public toString() {
        if(this.paths.length)
            return this.paths.join('.')
        return '{}'
    }
}

class EntityData extends Data {
    private target: TARGET
    constructor(target: TARGET) {
        super()
        this.target = target
    }
    public toString(): string {
        return `entity ${this.target} ${super.toString()}`
    }
}

class StorageData extends Data {
    private storage: string
    constructor(storage: string) {
        super()
        this.storage = storage
    }
    public toString(): string {
        return `storage ${config.namespace}:${this.storage} ${super.toString()}`
    }
}

class BlockData extends Data {
    private pos: Coordinate
    constructor(pos: Coordinate) {
        super()
        this.pos = pos
    }
    public toString(): string {
        return `block ${this.pos} ${super.toString()}`
    }
}

type OPERATORS = 'merge' | 'set' | 'insert' | 'append' | 'prepend' | 'remove' | 'get'
class DataModify extends Command {
    private op: OPERATORS
    private target: Data
    private source?: Data | NBTBase
    private index?: number

    constructor(op: 'remove' | 'get', target: Data)
    constructor(op: 'merge' | 'set' | 'append' | 'prepend', target: Data, source: Data | NBTBase)
    constructor(op: 'insert', target: Data, source: Data | NBTBase, index: number)

    constructor(op: OPERATORS, target: Data, source?: Data | NBTBase, index?: number) {
        super()
        this.op = op
        this.target = target
        if(typeof source !== 'undefined')
            this.source = source
        if(typeof index !== 'undefined')
            this.index = index
    }
    public toString(): string {
        let prep: string
        switch(this.op) {
            case 'remove':
            case 'get':
                return `data ${this.op} ${this.target}`
            case 'insert':
                prep = this.source instanceof Data? 'from' : 'value'
                return `data modify ${this.target} insert ${this.index} ${prep} ${this.source}`
            default:
                prep = this.source instanceof Data? 'from' : 'value'
                return `data modify ${this.target} ${this.op} ${prep} ${this.source}`
        }
    }
}

export let data = {
    block:(pos: Coordinate) => new BlockData(pos),
    entity:(target: TARGET) => new EntityData(target),
    storage: (name: string) => new StorageData(name)
}