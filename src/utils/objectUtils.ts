const sortObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObject)
  }

  const sorted: any = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = sortObject(obj[key])
    })
  return sorted
}

function isEmpty(value: unknown): boolean {
  return value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
}

function cleanEmptyParamsObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj
      .map(cleanEmptyParamsObject)
      .filter(item => !isEmpty(item))
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (key === 'data') {
      acc[key] = obj[key]
    } else {
      const value = cleanEmptyParamsObject(obj[key])
      if (!isEmpty(value)) {
        acc[key] = value
      }
    }
    return acc
  }, {} as Record<string, unknown>)
}


export { sortObject, cleanEmptyParamsObject }
