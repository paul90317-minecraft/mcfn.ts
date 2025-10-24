// https://minecraft.fandom.com/wiki/NBT_format

export abstract class NBTBase {
  abstract toString(): string
}

export class NBTByte extends NBTBase {
  constructor(public value: number | boolean) { super(); }
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
  constructor(public values: (number| boolean)[]) { super(); }
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

// https://minecraft.fandom.com/wiki/Formatting_codes
type COLOR_CODES =
  | 'black'
  | 'dark_blue'
  | 'dark_green'
  | 'dark_aqua'
  | 'dark_red'
  | 'dark_purple'
  | 'gold'
  | 'gray'
  | 'dark_gray'
  | 'blue'
  | 'green'
  | 'aqua'
  | 'red'
  | 'light_purple'
  | 'yellow'
  | 'white'
  | 'minecoin_gold' // 若支援
  | `#${string}`;   // 允許 HEX 顏色（如 "#512020ff"）


type FORMAT_KEYS =
  | 'obfuscated'
  | 'bold'
  | 'strikethrough'
  | 'underline'
  | 'italic';

type TEXT = {
  text: NBTString<string>,
  color?: NBTString<COLOR_CODES>,
} & Partial<Record<FORMAT_KEYS, NBTByte>>

type _TEXT = {
  text: string,
  color?: COLOR_CODES,
} & Partial<Record<FORMAT_KEYS, boolean>>

export class Text extends NBTCompound<TEXT> {
  constructor(
    _text: _TEXT
  ) {
    const { text, color, ...formats } = _text;

    const nbtFormats: Partial<Record<FORMAT_KEYS, NBTByte>> = {};
    for (const key in formats) {
      if (formats[key as FORMAT_KEYS] !== undefined) {
        nbtFormats[key as FORMAT_KEYS] = new NBTByte(Number(formats[key as FORMAT_KEYS]));
      }
    }
    super({
      text: new NBTString(text),
      ...(color !== undefined && { color: new NBTString(color) }),
      ...nbtFormats
    });
  }
}

export const nbt = {
  byte: (x: number | boolean) => new NBTByte(x),
  short: (x: number) => new NBTShort(x),
  int: (x: number) => new NBTInt(x),
  long: (x: number) => new NBTLong(x),
  list: <T extends NBTBase>(x: T[]) => new NBTList(x),
  compound: <T extends Record<string, NBTBase>>(x: T) => new NBTCompound(x),
  lbyte: (x: (number | boolean)[]) => new NBTByteArray(x),
  lint: (x: number[]) => new NBTIntArray(x),
  llong: (x: number[]) => new NBTLongArray(x),
  double: (x: number) => new NBTDouble(x),
  float: (x: number) => new NBTFloat(x),
  string: (x: string) => new NBTString(x),
  text: (_name: _TEXT) => new Text(_name)
}
