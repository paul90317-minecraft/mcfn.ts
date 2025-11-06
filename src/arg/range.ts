export type NubmerRangeInterface = {
    lower: number
    upper: number
} | {
    lower: number,
    upper?: number
} | {
    lower?: number,
    upper: number
}


export class NumberRange {
    lower?: number
    upper?: number
    constructor(range: NubmerRangeInterface) {
        if(range.lower !== undefined)
            this.lower = range.lower
        if(range.upper !== undefined)
            this.upper = range.upper
    }
    public toString(){
        if(this.lower === this.upper)
            return `${this.lower}`
        let l = this.lower ?? ''
        let r = this.upper ?? ''
        return `${l}..${r}`
    }
}