
export class Bound {
    lower?: number
    upper?: number
    constructor(bound: {
        lower?: number
        upper?: number
    }) {
        if(bound.lower)
            this.lower = bound.lower
        if(bound.upper)
            this.upper = bound.upper
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