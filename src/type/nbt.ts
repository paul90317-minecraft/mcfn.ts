// https://minecraft.fandom.com/wiki/NBT_format

export abstract class NBTBase {
  abstract toString(): string
}

export class NBTByte extends NBTBase {
  constructor(public value: number) { super(); }
  toString() {
    if (typeof this.value === "boolean")
      return this.value ? "1b" : "0b";
    return `${BigInt(this.value)}b`;
  }
}

export class NBTShort extends NBTBase {
  constructor(public value: number) { super(); }
  toString() { return `${BigInt(this.value)}s`; }
}

export class NBTInt extends NBTBase {
  constructor(public value: number) { super(); }
  toString() { return `${BigInt(this.value)}`; }
}

export class NBTLong extends NBTBase {
  constructor(public value: number) { super(); }
  toString() { return `${BigInt(this.value)}l`; }
}

export class NBTFloat extends NBTBase {
  constructor(public value: number) { super(); }
  toString() { return `${this.value}f`; }
}

export class NBTDouble extends NBTBase {
  constructor(public value: number) { super(); }
  toString() { return `${this.value}`; }
}

export class NBTString<T extends string> extends NBTBase {
  constructor(public value: T) { super(); }
  toString() {
    return `\"${this.value}\"`;
  }
}

export class NBTByteArray extends NBTBase {
  constructor(public values: number[]) { super(); }
  toString() {
    return `[B;${this.values.map(v => `${BigInt(v)}b`).join(',')}]`;
  }
}

export class NBTIntArray extends NBTBase {
  constructor(public values: number[]) { super(); }
  toString() {
    return `[I;${this.values.map(v => `${BigInt(v)}`).join(',')}]`;
  }
}

export class NBTLongArray extends NBTBase {
  constructor(public values: number[]) { super(); }
  toString() {
    return `[L;${this.values.map(v => `${BigInt(v)}l`).join(',')}]`;
  }
}

export class NBTList<T extends NBTBase> extends NBTBase {
  constructor(public values: T[]) { super(); }
  toString() {
    return `[${this.values.map(v => v.toString()).join(',')}]`;
  }
}

export class NBTCompound<T extends Record<string, NBTBase>> extends NBTBase {
  constructor(public value: T) { super(); }
  toString() {
    const entries = Object.entries(this.value)
      .map(([k, v]) => `${k}:${v.toString()}`)
      .join(',');
    return `{${entries}}`;
  }
}

let x = new NBTInt(5)