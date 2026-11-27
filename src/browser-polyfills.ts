import { Buffer } from 'buffer'
import process from 'process'

// OpenAPI/JSON Schema browser builds still use these Node globals.
// Load only the required shims, without Node's crypto modules.
if (typeof globalThis.Buffer === 'undefined') {
  Object.assign(globalThis, { Buffer })
}
if (typeof globalThis.process === 'undefined') {
  Object.assign(globalThis, { process })
}
