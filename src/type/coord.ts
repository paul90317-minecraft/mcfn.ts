// https://minecraft.fandom.com/wiki/Coordinates

const num = "\\d+\\.?|\\d*\\.\\d+"
const relate= `~?-?(${num})`;
const caret = `\\^-?(${num})`;

const coord_re = new RegExp(
  `^(${relate}) (${relate}) (${relate})|(${caret}) (${caret}) (${caret})`
);

export class Coordinate {
    private coordinate: string
    constructor(coordinate: string) {
        if(!coord_re.test(coordinate))
            throw new Error('Wrong format of coordinate')
        this.coordinate = coordinate
    }
    public toString() {
        return this.coordinate
    }
}

export function coord(coordinate: string) {
    return new Coordinate(coordinate)
}