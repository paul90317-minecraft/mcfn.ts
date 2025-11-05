
export class NumberRange {
    lower?: number
    upper?: number
    constructor(range: {
        lower?: number
        upper?: number
    }) {
        if(range.lower)
            this.lower = range.lower
        if(range.upper)
            this.upper = range.upper
    }
    public toString(){
        if(!this.lower && !this.upper)
            throw new Error('Undefined bound.')
        if(this.lower === this.upper)
            return `${this.lower}`
        let l = this.lower ?? ''
        let r = this.upper ?? ''
        return `${l}..${r}`
    }
}