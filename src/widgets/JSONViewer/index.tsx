import RefParser from '@apidevtools/json-schema-ref-parser'
import JSONSchemaView from 'json-schema-view-js'
import cloneDeep from 'lodash.clonedeep'
import React, { useEffect, useRef } from 'react'

import 'json-schema-view-js/dist/style.min.css'

interface JsonSchemaViewerProps {
  schema: object
}

const JsonSchemaViewer: React.FC<JsonSchemaViewerProps> = ({ schema }) => {
  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const schemas = cloneDeep(schema)
    let isMounted = true

    RefParser.dereference(
      schemas,
      {
        dereference: {
          circular: true
        }
      },
      (err: any, dereferencedSchema: any) => {
        if (isMounted) {
          if (err) {
            console.log(err)
          } else {
            const view = new JSONSchemaView(dereferencedSchema, 3)
            if (myRef.current) {
              myRef.current.appendChild(view.render())
            }
          }
        }
      }
    )

    return () => {
      isMounted = false
      if (myRef.current) {
        while (myRef.current.firstChild) {
          myRef.current.removeChild(myRef.current.firstChild)
        }
      }
    }
  }, [schema])

  return <div ref={myRef} />
}

export default JsonSchemaViewer
