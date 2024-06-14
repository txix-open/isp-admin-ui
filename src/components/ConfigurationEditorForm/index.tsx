import { Theme as AntDTheme } from '@rjsf/antd'
import { withTheme } from '@rjsf/core'
import { UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { FC, useEffect, useState } from 'react'

import { ConfigurationEditorPropsType } from '@pages/ConfigurationEditorPage'
import { Tabs } from 'antd'
import  equal   from 'deep-equal'
import { useParams } from 'react-router-dom'

const ConfigurationEditorForm: FC<ConfigurationEditorPropsType> = ({
                                                                     bufConfig ={},
                                                                     JsonSchema,
                                                                     setBufConfig,
                                                                   }) => {
  const Form = withTheme(AntDTheme)
  const sortProps = (a, b) => a.name.localeCompare(b.name)

  const [formState, setFormState] = useState(bufConfig.data)
  const [activeTabKey, setActiveTabKey] = useState()
  const {id} = useParams()

  useEffect(() => {
   if(!equal(formState, bufConfig.data)) {
     setFormState(bufConfig.data)
   }
  }, [bufConfig.data])

  const uiSchema: UiSchema = {
    'ui:submitButtonOptions': {
      norender: true
    }
  }

  const onFormChange = data => {
    if(!equal(data.formData, bufConfig.data)) {
      const newData = {
            ...bufConfig,
            data: { ...data.formData }
          }
          if(!equal(newData, bufConfig.data)) {
            setBufConfig(newData)
          }

    }
  }

  const handleTabsChange = e => {
      setActiveTabKey(e)
  }

  const ObjectFieldTemplate = (props) => {
    const {
      properties,
      idSchema,
      schema: { properties: schemaProperties }
    } = props
    properties.sort(sortProps)

    if (idSchema.$id === 'root') {
      const propsComplex: [] = []
      const propsSimple: [] = []

      properties.forEach((prop) => {
        const fieldType = schemaProperties[prop.name].type
        if (!fieldType || fieldType === 'array' || fieldType === 'object') {
          propsComplex.push(prop)
        } else {
          propsSimple.push(prop)
        }
      })

      return (
        <Tabs activeKey={activeTabKey} tabPosition="right" onChange={handleTabsChange} items={[
          ...(propsSimple.length ? [{
            label: 'Остальные',
            key: 'General',
            children: propsSimple.map((element) => element.content),
          }] : []),
          ...propsComplex.map((element) => ({
            label: schemaProperties[element.name]?.title || element.name,
            key: element.name,
            children: element.content,
          })),
        ]} />
      )
    }

    return properties.map((element) => element.content)
  }

  return (
    <section className="configuration-editor-page__form">
      <Form
        formContext={{
          // labelCol: { span: 8 },
          // wrapperCol: { span: 30 },
          // layout: 'horizontal'
        }}
        uiSchema={uiSchema}
        templates={{ ObjectFieldTemplate }}
        validator={validator}
        schema={JsonSchema?.schema}
        formData={id === 'new' ?  {} : formState}
        onChange={onFormChange}
      ></Form>
    </section>
  )
}

export default ConfigurationEditorForm
