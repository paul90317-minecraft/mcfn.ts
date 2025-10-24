import { config } from "../config";
import { Command } from "../core/scope";
import { Text } from "../type/nbt";
import { TARGET } from "../type/selector";

export type BOSSBAR_COLOR = 
  | 'blue' | 'green' | 'pink' | 'purple' | 'red' 
  | 'white' | 'yellow';

export type BOSSBAR_STYLE = 
  | 'notched_6' | 'notched_10' | 'notched_12' 
  | 'notched_20' | 'progress';

class AddBossbarCommand extends Command {
  constructor(private bossbar: BossBar, private name: string) {
    super();
  }
  toString() {
    return `bossbar add ${this.bossbar} ${this.name}`;
  }
}

class RemoveBossbarCommand extends Command {
  constructor(private bossbar: BossBar) {
    super();
  }
  toString() {
    return `bossbar remove ${this.bossbar}`;
  }
}

class SetBossbarCommand extends Command {
  constructor(private bossbar: BossBar, private property: string, private value?: any) {
    super();
  }
  toString() {
    const v = this.value === undefined ? '' : String(this.value);
    return `bossbar set ${this.bossbar} ${this.property} ${v}`.trim();
  }
}

class GetBossbarCommand extends Command {
  constructor(private bossbar: BossBar, private property: 'max' | 'players' | 'value' | 'visible') {
    super();
  }
  toString() {
    return `bossbar get ${this.bossbar} ${this.property}`;
  }
}

class ListBossbarCommand extends Command {
  toString() {
    return `bossbar list`;
  }
}

export const bossbars: Record<string, BossBar> = {}

export class BossBar {
  private id: string;
  private name: string;

  constructor(name: string, id?: string) {
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

  _create(): this {
    new AddBossbarCommand(this, this.name)
    return this
  }

  _remove(): this {
    new RemoveBossbarCommand(this)
    return this
  }

  set = {
    color: (c: BOSSBAR_COLOR): this => {
      new SetBossbarCommand(this, 'color', c)
      return this
    },
    max: (n: number): this => {
      if (n < 1 || n > 2147483647)
        throw new Error("Max value must be between 1 and 2147483647.")
      new SetBossbarCommand(this, 'max', n)
      return this
    },
    name: (s: string): this => {
      new SetBossbarCommand(this, 'name', s)
      return this
    },
    players: (t?: TARGET): this => {
      new SetBossbarCommand(this, 'players', t)
      return this
    },
    style: (s: BOSSBAR_STYLE): this => {
      new SetBossbarCommand(this, 'style', s)
      return this
    },
    value: (n: number): this => {
      if (n < 0 || n > 2147483647)
        throw new Error("Value must be between 0 and 2147483647.")
      new SetBossbarCommand(this, 'value', n)
      return this
    },
    visible: (b: boolean): this => {
      new SetBossbarCommand(this, 'visible', b)
      return this
    }
  }

  get = {
    max: (): void => { new GetBossbarCommand(this, 'max') },
    value: (): void => { new GetBossbarCommand(this, 'value') },
    players: (): void => { new GetBossbarCommand(this, 'players') },
    visible: (): void => { new GetBossbarCommand(this, 'visible') }
  }
}

export const bossbar = Object.assign((name: Text[] | Text, id?: string)=> {
    return new BossBar(`${name}`, id)
}, {
  list: (): void => { new ListBossbarCommand() }
})
