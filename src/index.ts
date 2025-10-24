/*import { execute } from "./command/execute";
import { say } from "./command/say";
import { minecraft } from "./core/tag";
import { Selector } from "./var/selector";
import { Objective } from './core/objective'
import { CallTracker } from "assert/strict";

let obj = new Objective()
minecraft.load(()=>{
    execute.as(new Selector('@a')).run(()=>{
        say('hello')
        let score = obj.get(new Selector('@s', {
            distance: {upper: 15}
        }))
        
        score.addby(1)
        execute.if(score.matches({lower:4})).run(()=>{
            score.reset()
        }, true)
    })
})*/

/*
let a = (x: number)=>{}
type FN = ()=>void
if(a instanceof Function)
    console.log('yes')
console.log(typeof(a))
*/


class A  {
    constructor(){
    }
    call() {
        console.log(`Hello,workd!\n`)
    }
}

function makeCallable(): A & (() => void){
    let a = new A()
    let fn = a.call.bind(a)
    return Object.assign(fn, a)
}

let a = makeCallable()
a()
a.call()
