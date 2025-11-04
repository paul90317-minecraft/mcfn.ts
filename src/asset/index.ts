import { Model, models } from './model'
import { textures, texture } from './texture'
import { item_models, ItemModel } from './item'
import { Equipment, equipments } from './equipment'
import { config } from '../config'
import fs from 'fs'
import { object_to_string } from '../type'

export * from './model'
export * from './texture'
export * from './item'

export const resourcepack = {
    model(data: object, name?: string) {
        return new Model(data, name)
    },
    item(data: object, name?: string) {
        return new ItemModel(data, name)
    },
    equipment(data: object, name?: string) {
        return new Equipment(data, name)
    },
    _create() {
        fs.mkdirSync(config.resourcepack.outdir ,{
            recursive: true
        })
        fs.writeFileSync(`${config.resourcepack.outdir}/pack.mcmeta`, object_to_string(config.resourcepack.mcmeta))

        Object.values(item_models).forEach(t => t._create())
        Object.values(textures).forEach(t => t._create())
        Object.values(models).forEach(t => t._create())
        Object.values(equipments).forEach(t => t._create())
    },
    texture
}