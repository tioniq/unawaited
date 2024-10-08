type PromiseOrNothing = Promise<any> | PromiseLike<any> | undefined | null | void

/**
 * A source key that can be used to identify the source of the error
 */
export type Source = Symbol | string | number | object | null | undefined

/**
 * A callback that takes an error as an argument
 */
export type ErrorCallback = (e: any) => void

/**
 * A callback that takes an error as an argument or a source key
 */
export type ErrorCallbackOrSource = ErrorCallback | Source

/**
 * A function that takes a promise or function that returns a promise and handles it to prevent unhandled promise
 * rejections. It will never throw an error. If the promise or function throws an error, it will be caught and passed
 * to the `unawaited.exceptionHandler` function. If the promise or function is not a promise or function, it will be
 * passed to the `unawaited.unknownValueHandler` function. Argument `source` is optional and can be used to identify
 * the source of the promise or function if needed.
 *
 * @param promiseOrFunction The promise or function that returns a promise to handle
 * @param errorCallbackOrSource The source of the promise or function
 */
export function unawaited(promiseOrFunction: (() => PromiseOrNothing) | PromiseOrNothing, errorCallbackOrSource?: ErrorCallbackOrSource): void {
  if (!promiseOrFunction) {
    return
  }
  if (promiseOrFunction instanceof Promise) {
    handlePromise(promiseOrFunction, errorCallbackOrSource)
    return
  }
  if (typeof promiseOrFunction !== "function") {
    if (typeof promiseOrFunction === "object") {
      if (typeof promiseOrFunction.then === "function") {
        handlePromiseLike(promiseOrFunction, errorCallbackOrSource)
        return
      }
    }
    unawaited.unknownValueHandler(promiseOrFunction, errorCallbackOrSource)
    return
  }
  let result: any
  try {
    result = promiseOrFunction()
  } catch (e) {
    handleException(e, errorCallbackOrSource)
  }
  if (result instanceof Promise) {
    handlePromise(result, errorCallbackOrSource)
    return
  }
  if (typeof result === "object") {
    if (typeof result.then === "function") {
      handlePromiseLike(result, errorCallbackOrSource)
    }
  }
}

function handlePromise(promise: Promise<any>, errorCallbackOrSource: ErrorCallbackOrSource): void {
  try {
    promise.catch(e => handleException(e, errorCallbackOrSource))
  } catch (e) {
    handleException(e, errorCallbackOrSource)
  }
}

function handlePromiseLike(promiseLike: PromiseLike<any>, errorCallbackOrSource: ErrorCallbackOrSource): void {
  try {
    Promise.resolve(promiseLike).catch(e => handleException(e, errorCallbackOrSource))
  } catch (e) {
    handleException(e, errorCallbackOrSource)
  }
}

function handleException(e: any, errorCallbackOrSource: ErrorCallbackOrSource): void {
  if (typeof errorCallbackOrSource !== "function") {
    unawaited.exceptionHandler(e, errorCallbackOrSource)
    return
  }
  errorCallbackOrSource(e)
  if (unawaited.alwaysPassExceptionToHandler) {
    unawaited.exceptionHandler(e, errorCallbackOrSource)
  }
}

/**
 * Override this function to handle exceptions that occur when a promise or function throws an error.
 * @param e The error that was thrown
 * @param source The source of the promise or function
 */
unawaited.exceptionHandler = function (e: any, source: ErrorCallbackOrSource): void {

}

/**
 * Override this function to handle values that are not promises or functions.
 * @param value The value that was not a promise or function
 * @param source The source of the value
 */
unawaited.unknownValueHandler = function (value: any, source: ErrorCallbackOrSource): void {

}

/**
 * If true, exceptions will always be passed to the exception handler even if an error callback is provided.
 */
unawaited.alwaysPassExceptionToHandler = true