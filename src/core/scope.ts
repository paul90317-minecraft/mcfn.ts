const stack: Scope[] = []

export abstract class Command {
    public abstract toString(): string;

    constructor() {
        let latest = stack.at(-1)
        if (!latest) {
            throw new Error('Command should be written in mcfunction.');
        }
        latest.add(this)
    }
}

export abstract class Scope {
    protected commands: Command[]
    constructor(fn: () => void) {
        this.commands = []
        stack.push(this)
        fn()
        stack.pop()
    }

    public add(cmd: Command){
        this.commands.push(cmd)
    }
}

export class InlineScope extends Scope {
    constructor(fn: ()=>void) {
        super(fn)
    }
    public add(cmd: Command): void {
        if(this.commands.length)
            throw new Error('Only one command is allowed in inline scope.')
        super.add(cmd)
    }
    public get() {
        if(!this.commands.length)
            throw Error('No command in the inline scope.')
        return this.commands[0]!
    }
}