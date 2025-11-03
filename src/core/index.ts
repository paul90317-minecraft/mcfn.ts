import { tags } from './tag'
import { datapack as _datapack } from './registry'
export const datapack = {..._datapack, tags}
export { type ITEM, type BLOCK, type ENTITY_TYPE } from './tag'
export { LootTable, Predicate, ItemModifier } from './registry'
export { minecraft } from './minecraft'
