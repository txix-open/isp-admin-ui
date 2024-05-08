import { ModalPropsType } from '@widgets/Modal/modal.type.ts'

export interface ConfigSchemaModalPropsType
  extends Omit<ModalPropsType, 'title' | 'children'> {
  schema: JSONSchema
}
