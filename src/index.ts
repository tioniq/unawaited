type PromiseOrNothing = Promise<any> | PromiseLike<any> | undefined | null | void

/**
 * A function that takes a promise or function that returns a promise and handles it to prevent unhandled promise
 * rejections. It will never throw an error. If the promise or function throws an error, it will be caught and passed
 * to the `unawaited.exceptionHandler` function. If the promise or function is not a promise or function, it will be
 * passed to the `unawaited.unknownValueHandler` function. Argument `source` is optional and can be used to identify
 * the source of the promise or function if needed.
 *
 * @param promiseOrFunction The promise or function that returns a promise to handle
 * @param source The source of the promise or function
 */
export function unawaited(promiseOrFunction: (() => PromiseOrNothing) | PromiseOrNothing, source?: any): void {
  if (!promiseOrFunction) {
    return
  }
  if (promiseOrFunction instanceof Promise) {
    handlePromise(promiseOrFunction, source)
    return
  }
  if (typeof promiseOrFunction !== "function") {
    if (typeof promiseOrFunction === "object") {
      if (typeof promiseOrFunction.then === "function") {
        handlePromiseLike(promiseOrFunction, source)
        return
      }
    }
    unawaited.unknownValueHandler(promiseOrFunction, source)
    return
  }
  let result: any
  try {
    result = promiseOrFunction()
  } catch (e) {
    unawaited.exceptionHandler(e, source)
  }
  if (result instanceof Promise) {
    handlePromise(result, source)
    return
  }
  if (typeof result === "object") {
    if (typeof result.then === "function") {
      handlePromiseLike(result, source)
    }
  }
}

function handlePromise(promise: Promise<any>, source: any): void {
  try {
    promise.catch(e => unawaited.exceptionHandler(e, source))
  } catch (e) {
    unawaited.exceptionHandler(e, source)
  }
}

function handlePromiseLike(promiseLike: PromiseLike<any>, source: any): void {
  try {
    Promise.resolve(promiseLike).catch(e => unawaited.exceptionHandler(e, source))
  } catch (e) {
    unawaited.exceptionHandler(e, source)
  }
}

/**
 * Override this function to handle exceptions that occur when a promise or function throws an error.
 * @param e The error that was thrown
 * @param source The source of the promise or function
 */
unawaited.exceptionHandler = function (e: any, source: any): void {

}

/**
 * Override this function to handle values that are not promises or functions.
 * @param value The value that was not a promise or function
 * @param source The source of the value
 */
unawaited.unknownValueHandler = function (value: any, source: any): void {

}
