import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Theme as AntDTheme } from '@rjsf/antd'
import { withTheme } from '@rjsf/core'
import { UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import {
  Badge,
  Button,
  Tabs,
  Tooltip,
  Form as FormAntd,
  Collapse,
  Typography,
  Space
} from 'antd'
import equal from 'deep-equal'
import { createRef, FC, memo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'



import {
  ArrayFieldTemplatePropsType,
  ConfigurationEditorPropsType,
  DescriptionPropsType,
  ErrorsObjType,
  FieldTemplatePropsType,
  ObjectFieldTemplatePropertyType,
  ObjectFieldTemplatePropsType,
  SortPropType
} from '@pages/ConfigurationEditorPage/ConfigurationEditor.type.ts'
import { ResponseSchemaType } from '@pages/ModulesPage/module.type.ts'
import { cleanEmptyParamsObject } from '@utils/objectUtils.ts'
const { Text: AntdText } = Typography

const ConfigurationEditorForm: FC<ConfigurationEditorPropsType> = ({
                                                                     bufConfig = {},
                                                                     jsonSchema = {},
                                                                     submitRef,
                                                                   }) => {
  const Form = withTheme(AntDTheme)
  const sortProps = (a: SortPropType, b: SortPropType) =>
    a.name.localeCompare(b.name)

  const [formState, setFormState] = useState(bufConfig.data)
  const { id } = useParams()
  const formRef = createRef<any>()

  useEffect(() => {
    if (!equal(formState, bufConfig.data)) {
      setFormState(bufConfig.data)
    }
  }, [bufConfig.data])

  const uiSchema: UiSchema = {
    'ui:submitButtonOptions': {
      norender: true
    }
  }

  const onSubmit = (data: any) => {
    if(!submitRef) return
      if(!formRef.current.validateFormWithFormData(formRef.current.state.formData)) {
        submitRef.current = data
      } else {
        submitRef.current = data.formData
      }

  }

  const forceSubmit = () => {
    if (formRef.current) {
      const formData = formRef.current.state.formData

      onSubmit(cleanEmptyParamsObject(formData))
    }
  }

  const onFormChange = () => {
    if (!formRef.current) return
      if(formRef.current.validateFormWithFormData(formRef.current.state.formData)) {
        formRef?.current?.submit()
      } else {
        forceSubmit()
      }
  }



  const Description: FC<DescriptionPropsType> = ({ description }) =>
    description ? (
      <span>
        &nbsp;
        <Tooltip title={description}></Tooltip>
      </span>
    ) : null

  const getDepth = (id: string) => {
    if (!id) {
      return 0
    }
    return id.split('_').length
  }

  const getName = (id: string) => {
    if (!id) {
      return ''
    }
    const arr = id.split('_')
    return `#${arr[arr.length - 1] || ''}`
  }

  const FieldTemplate: FC<FieldTemplatePropsType> = (props) => {
    const {
      id,
      classNames,
      label,
      rawHelp,
      required,
      rawDescription,
      rawErrors,
      children,
      displayLabel,
      schema
    } = props

    const isObject = schema.type === 'object'
    const depth = getDepth(id)
    const name = label || getName(id)

    // Проверяем на наличие ошибок и формируем их вывод
    const errorMessages = rawErrors ? rawErrors.join('\n') : null

    // Объекты и массивы - Обработка по глубине
    if (isObject && depth !== 1) {
      const title = (
        <div className={required ? 'ant-form-item-required' : ''}>
          {depth !== 2 && <AntdText strong>{name}</AntdText>}
          {errorMessages && (
            <AntdText type="danger">{` (${errorMessages})`}</AntdText>
          )}
          {depth !== 2 && <Description description={rawDescription} />}
        </div>
      )

      if (depth === 2 || schema.dynamic) {
        return (
          <div style={{ width: '100%' }}>
            {!schema.dynamic && title}
            {children}
          </div>
        )
      }

      return (
        <Collapse className="collapse" defaultActiveKey={depth > 1 ? '' : id}>
          <Collapse.Panel
            key={id}
            className="configEditor_collapseObject"
            header={title}
          >
            {children}
          </Collapse.Panel>
        </Collapse>
      )
    }

    // Для остальных типов возвращаем форму с элементами
    return (
      <FormAntd.Item
        className={classNames}
        validateStatus={errorMessages ? 'error' : undefined}
        help={errorMessages || undefined}
        extra={rawHelp}
        required={required}
        label={
          displayLabel && !schema.dynamic ? (
            <>
              {name}
              <Description description={rawDescription} />
            </>
          ) : null
        }
      >
        {children}
      </FormAntd.Item>
    )
  }

  const ArrayFieldTemplate: FC<ArrayFieldTemplatePropsType> = ({
                                                                 items,
                                                                 onAddClick,
                                                                 canAdd,
                                                                 title,
                                                                 idSchema,
                                                                 schema: { description }
                                                               }) => {
    return (
      <Collapse defaultActiveKey={idSchema.$id}>
        <Collapse.Panel
          key={idSchema.$id}
          className="collapseArray"
          header={
            <Space
              direction="horizontal"
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              <Space direction="horizontal">
                <AntdText>{title}</AntdText>
                <Badge count={items ? items.length : 0} showZero />
                <Description description={description} />
              </Space>
              {canAdd && (
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddClick(e as unknown as MouseEvent)
                  }}
                />
              )}
            </Space>
          }
        >
          {items &&
            items.map((element) => (
              <div key={element.index} className="collapseArray_item">
                <div className="collapseArray_item_content">
                  {element.children}
                </div>
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={element.onDropIndexClick(element.index)}
                />
              </div>
            ))}
        </Collapse.Panel>
      </Collapse>
    )
  }

  const ObjectFieldTemplate: FC<ObjectFieldTemplatePropsType> = (props) => {
    const {
      properties,
      idSchema,
      schema: { properties: schemaProperties },
      activeTabKey,
      handleTabsChange
    } = props

    properties.sort(sortProps)
    if (idSchema.$id === 'root') {
      const propsComplex: ObjectFieldTemplatePropertyType[] = []
      const propsSimple: ObjectFieldTemplatePropertyType[] = []

      properties.forEach((prop) => {
        const fieldType = schemaProperties[prop.name]?.type
        if (!fieldType || fieldType === 'array' || fieldType === 'object') {
          propsComplex.push(prop)
        } else {
          propsSimple.push(prop)
        }
      })

      return (
        <Tabs
          activeKey={activeTabKey}
          tabPosition="right"
          onChange={handleTabsChange}
          items={[
            ...(propsSimple.length
              ? [
                {
                  label: 'Остальные',
                  key: 'General',
                  children: propsSimple.map((element) => element.content)
                }
              ]
              : []),
            ...propsComplex.map((element) => ({
              label: schemaProperties[element.name]?.title || element.name,
              key: element.name,
              children: element.content
            }))
          ]}
        />
      )
    }
    return <>{properties.map((element) => element.content)}</>
  }

  const transformErrors = (errors: ErrorsObjType[]): ErrorsObjType[] => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        error.message = 'Поле является обязательным'
      })
    }

    return errors
  }

  return (
    <section className="configuration-editor-page__form">
      <Form
        formContext={{
          labelCol: { span: 8 },
          wrapperCol: { span: 30 },
          layout: 'vertical'
        }}
        uiSchema={uiSchema}
        templates={{
          ObjectFieldTemplate: ObjectFieldTemplate as any,
          FieldTemplate: FieldTemplate as any,
          ArrayFieldTemplate: ArrayFieldTemplate as any
        }}
        ref={formRef}
        transformErrors={transformErrors as any}
        schema={jsonSchema?.schema as ResponseSchemaType}
        onSubmit={onSubmit}
        validator={validator}
        formData={id === 'new' ? {} : formState}
        onChange={onFormChange}
        showErrorList={false}
      ></Form>
    </section>
  )
}

export default memo(ConfigurationEditorForm)
