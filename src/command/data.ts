import { Command } from "../core/scope"
import { Coordinate } from "../type/coord"
import { NBTBase, NBTCompound } from "../type/nbt"
import { TARGET } from "../type/selector"
import { config } from "../config"

export abstract class Data {
    protected readonly paths: string[];

    constructor(paths: string[] = []) {
        this.paths = [...paths];
    }

    /**
     * 返回新的 Data 實例（不會改動舊的 paths）
     */
    public at(key: string | NBTCompound<Record<string, NBTBase>> | number): Data {
        let nextKey: string;
        if (key instanceof NBTBase || typeof key === 'number') {
            nextKey = `[${key}]`;
        } else {
            if (!/^[A-Za-z0-9_\:]+$/.test(key))
                throw new Error('Wrong format of data path.');
            nextKey = key;
        }

        // 建立新的 Data 子類實例（this.constructor 可維持動態類別）
        const next = this._clone([
            ...this.paths,
            nextKey,
        ]);
        return next;
    }

    public merge(source: Data | NBTBase) {
        new DataModify('merge', this, source);
    }

    public set(source: Data | NBTBase) {
        new DataModify('set', this, source);
    }

    public append(source: Data | NBTBase) {
        new DataModify('append', this, source);
    }

    public prepend(source: Data | NBTBase) {
        new DataModify('prepend', this, source);
    }

    public insert(source: Data | NBTBase, index: number) {
        new DataModify('insert', this, source, index);
    }

    public remove() {
        new DataModify('remove', this);
    }

    public get() {
        new DataModify('get', this);
    }

    public toString() {
        return this.paths.length ? this.paths.join('.') : '{}';
    }

    protected abstract  _clone(paths: string[]): Data
}


class EntityData extends Data {
    private target: TARGET
    constructor(target: TARGET, paths: string[] = []) {
        super(paths)
        this.target = target
    }
    public toString(): string {
        return `entity ${this.target} ${super.toString()}`
    }
    protected _clone(paths: string[]) {
        return new EntityData(this.target, paths)
    }
}

class StorageData extends Data {
    private storage: string
    constructor(storage: string, paths: string[] = []) {
        super(paths)
        this.storage = storage
    }
    public toString(): string {
        return `storage ${config.namespace}:${this.storage} ${super.toString()}`
    }
    protected _clone(paths: string[]) {
        return new StorageData(this.storage, paths)
    }
}

class BlockData extends Data {
    private pos: Coordinate
    constructor(pos: Coordinate, paths: string[] = []) {
        super(paths)
        this.pos = pos
    }
    public toString(): string {
        return `block ${this.pos} ${super.toString()}`
    }
    protected _clone(paths: string[]) {
        return new BlockData(this.pos, paths)
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