import { config } from "../config";
import { Command } from "../core/scope";
import { NBTText, NBTTextRef } from "../arg/nbt";
import { TargetRef } from "../arg/selector";
import { raw } from "./raw";

export type BossBarColorID = 
  | 'blue' | 'green' | 'pink' | 'purple' | 'red' 
  | 'white' | 'yellow';

export type BossBarStyleID = 
  | 'notched_6' | 'notched_10' | 'notched_12' 
  | 'notched_20' | 'progress';

export const bossbars: Record<string, BossBar> = {}

type BossBarSetObject = {
  color: BossBarColorID,
  max: number,
  name: NBTTextRef,
  players: TargetRef,
  style: BossBarStyleID,
  value: number,
  visible: boolean
}

export class BossBar {
  private id: string;
  private name: NBTTextRef;

  constructor(name: NBTTextRef, id?: string) {
    if (id) {
      if (id == '_') throw new Error('The bossbar id started with _ is not allowed.')
      if (id in bossbars) throw new Error('Duplicated bossbar id declared.')
      this.id = id
    } else {
      this.id = `_${Object.keys(bossbars).length}`
    }
    bossbars[this.id] = this
    this.name = name
  }

  toString() {
    return `${config}:${this.id}`
  }

  _create() {
    raw(`bossbar add ${this} ${this.name}`)
  }

  _remove() {
   raw(`bossbar remove ${this}`)
  }

  set(arg: BossBarSetObject) {
    Object.entries(arg).forEach(([k, v]) => {
      raw(`bossbar set ${this} ${k} ${v}`)
    })
  }
  get(property: 'max' | 'value' | 'players' | 'visible') {
    raw(`bossbar get ${this} ${property}`)
  }
}

export const bossbar = Object.assign((name: NBTTextRef, id?: string)=> {
    return new BossBar(name, id)
}, {
  list: () => raw(`bossbar list`)
})
