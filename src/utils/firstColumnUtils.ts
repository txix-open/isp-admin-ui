import { ColumnItem } from 'isp-ui-kit/dist/Layout/Column/column.type'

export const filterFirstColumnItems = <T extends NonNullable<unknown>>(
  listItems: ColumnItem<T>[],
  searchValue: string
): ColumnItem<T>[] =>
  listItems
    ? listItems.filter((el) =>
        el.name.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
      )
    : []
