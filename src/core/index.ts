import { tags } from './tag'
import { datapack as _datapack } from './registry'
export const datapack = {..._datapack, tags}
export { type ItemTypeRef as ITEM, type BlockRef as BLOCK, type EntityTypeRef as ENTITY_TYPE } from './tag'
export { LootTable, Predicate, ItemModifier } from './registry'
export { minecraft } from './minecraft'
