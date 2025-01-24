import { DeleteOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import { Control, Controller, useController } from 'react-hook-form'

import './object-field-renderer.scss'

export interface ObjectFieldRendererPropsType {
  name: string
  control: Control<any>
  readOnly: boolean
}

export type FieldEsiPropsType = string[][]

export interface ObjectEntriesValueType {
  [key: string]: string
}

export const ObjectFieldRenderer = ({
  name,
  control,
  readOnly
}: ObjectFieldRendererPropsType) => {
  const [entries, setEntries] = useState<FieldEsiPropsType>([])
  const {
    field: { value }
  } = useController({ name, control })

  useEffect(() => {
    if (value && entries.length === 0) {
      setEntries(Object.entries(value))
    }
  }, [value])
  const entriesToObject = (entries: FieldEsiPropsType) =>
    entries.reduce(
      (obj, [key, value]) => (key ? { ...obj, [key]: value } : obj),
      {}
    )

  const handleAddField = () => {
    const updatedEntries = [...entries, ['', '']]
    setEntries(updatedEntries)
  }

  const handleRemoveField = (
    index: number,
    onChange: (el: ObjectEntriesValueType) => void
  ) => {
    const updatedEntries = entries.filter((_, i) => i !== index)
    setEntries(updatedEntries)
    onChange(entriesToObject(updatedEntries))
  }

  const getUpdatedEntries = (index: number, newValue: string, order: number) =>
    entries.map((entry, i) => {
      if (order === 0) {
        return i === index ? [newValue, entry[1]] : entry
      }
      return i === index ? [entry[0], newValue] : entry
    })

  const handleChangeKey = (
    index: number,
    newKey: string,
    onChange: (el: ObjectEntriesValueType) => void
  ) => {
    const updatedEntries = getUpdatedEntries(index, newKey, 0)
    setEntries(updatedEntries)
    onChange(entriesToObject(updatedEntries))
  }

  const handleChangeValue = (
    index: number,
    newValue: string,
    onChange: (el: ObjectEntriesValueType) => void
  ) => {
    const updatedEntries = getUpdatedEntries(index, newValue, 1)
    setEntries(updatedEntries)
    onChange(entriesToObject(updatedEntries))
  }
  const renderConditionFields = (
    onChange: (el: ObjectEntriesValueType) => void
  ) => (
    <>
      {entries.map(([key, value], index) => (
        <div key={index} className="object-component__field">
          <Input
            disabled={readOnly}
            style={{ maxWidth: 185 }}
            placeholder="Ключ"
            value={key}
            onChange={(e) => handleChangeKey(index, e.target.value, onChange)}
          />
          <Input
            disabled={readOnly}
            style={{ maxWidth: 185 }}
            placeholder="Значение"
            value={value}
            onChange={(e) => handleChangeValue(index, e.target.value, onChange)}
          />
            <Button
              disabled={readOnly}
              className="object-component__field__remove-btn"
              danger
              type="primary"
              onClick={() => handleRemoveField(index, onChange)}
              icon={<DeleteOutlined />}
            />
        </div>
      ))}
    </>
  )
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="object-component">
          <div className="object-component__content">
            {renderConditionFields(field.onChange)}
          </div>
          <div className="object-component__add-btn">
            <Button  disabled={readOnly} onClick={handleAddField}>Добавить заголовок</Button>
          </div>
        </div>
      )}
    />
  )
}
