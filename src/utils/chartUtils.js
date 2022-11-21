import jsonlint from 'jsonlint-mod'

export function parseJsonSwallowError (str, errorCallback) {
  if (str) {
    try {
      jsonlint.parse(str)
      return JSON.parse(str)
    } catch (e) {
      if (errorCallback) {
        errorCallback(e.message)
      }
    }
  }
  return null
}
