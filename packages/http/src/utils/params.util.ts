import { forOwn, assign } from 'lodash'
import { ParamMetadata } from '../interfaces/params-metadata.interface'
import {
  PARAMETER_BODY_METADATA,
  PARAMETER_QUERY_METADATA,
  PARAMETER_PARAM_METADATA,
  PARAMETER_HEADER_METADATA,
} from '../http.constants'

export const getRequestParams = (metadata: Record<string, ParamMetadata>, args: any[]) => {
  const data = {}
  const params = {}
  const uriParams = {}
  const headers = {}

  forOwn(metadata, (meta, key) => {
    let target: Record<string, any> = {}

    switch (key.split(':')[0]) {
      case PARAMETER_BODY_METADATA:
        target = data
        break
      case PARAMETER_PARAM_METADATA:
        target = uriParams
        break
      case PARAMETER_QUERY_METADATA:
        target = params
        break
      case PARAMETER_HEADER_METADATA:
        target = headers
        break
    }

    const value = meta.index.toString().startsWith('const__') ? meta.value : args[meta.index]
    if (meta.data) {
      target[meta.data] = value
    } else {
      assign(target, value)
    }
  })

  return { data, params, uriParams, headers }
}
