// https://minecraft.wiki/w/Slot
import fs from 'fs'

let slots = []
let wildcards = []

wildcards.push('*')

slots.push('contents')
for(let i =0; i<=53; i++) {
    slots.push(`container.${i}`)
}
wildcards.push('container.*')

for(let i =0; i<=8; i++) {
    slots.push(`hotbar.${i}`)
}
wildcards.push('hotbar.*')

for(let i =0; i<=26; i++) {
    slots.push(`inventory.${i}`)
}
wildcards.push('inventory.*')

for(let i =0; i<=26; i++) {
    slots.push(`enderchest.${i}`)
}
wildcards.push('enderchest.*')

for(let i =0; i<=7; i++) {
    slots.push(`villager.${i}`)
}
wildcards.push('villager.*')

for(let i =0; i<=14; i++) {
    slots.push(`horse.${i}`)
}
wildcards.push('horse.*')

for(let i =0; i<=3; i++) {
    slots.push(`player.crafting.${i}`)
}
wildcards.push('player.crafting.*')

slots.push('weapon')
slots.push('weapon.mainhand')
slots.push('weapon.offhand')
slots.push('armor.feet')
slots.push('armor.legs')
slots.push('armor.chest')
slots.push('armor.head')
slots.push('armor.body')
slots.push('horse.saddle')
slots.push('horse.chest')
slots.push('player.cursor')

let data = `export type ITEM_SLOTS = ${slots.map(s=>`'${s}'`).join(' | ')};\n`
data += `export type SLOT_WILDCARD = ${wildcards.map(s=>`'${s}'`).join(' | ')};\n`
fs.writeFileSync('src/enum/extend/item_slot.ts', data)
