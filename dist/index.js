// src/index.ts
function unawaited(promiseOrFunction, errorCallbackOrSource) {
  if (!promiseOrFunction) {
    return;
  }
  if (promiseOrFunction instanceof Promise) {
    handlePromise(promiseOrFunction, errorCallbackOrSource);
    return;
  }
  if (typeof promiseOrFunction !== "function") {
    if (typeof promiseOrFunction === "object") {
      if (typeof promiseOrFunction.then === "function") {
        handlePromiseLike(promiseOrFunction, errorCallbackOrSource);
        return;
      }
    }
    unawaited.unknownValueHandler(promiseOrFunction, errorCallbackOrSource);
    return;
  }
  let result;
  try {
    result = promiseOrFunction();
  } catch (e) {
    handleException(e, errorCallbackOrSource);
  }
  if (result instanceof Promise) {
    handlePromise(result, errorCallbackOrSource);
    return;
  }
  if (typeof result === "object") {
    if (typeof result.then === "function") {
      handlePromiseLike(result, errorCallbackOrSource);
    }
  }
}
function handlePromise(promise, errorCallbackOrSource) {
  try {
    promise.catch((e) => handleException(e, errorCallbackOrSource));
  } catch (e) {
    handleException(e, errorCallbackOrSource);
  }
}
function handlePromiseLike(promiseLike, errorCallbackOrSource) {
  try {
    Promise.resolve(promiseLike).catch((e) => handleException(e, errorCallbackOrSource));
  } catch (e) {
    handleException(e, errorCallbackOrSource);
  }
}
function handleException(e, errorCallbackOrSource) {
  if (typeof errorCallbackOrSource !== "function") {
    unawaited.exceptionHandler(e, errorCallbackOrSource);
    return;
  }
  errorCallbackOrSource(e);
  if (unawaited.alwaysPassExceptionToHandler) {
    unawaited.exceptionHandler(e, errorCallbackOrSource);
  }
}
unawaited.exceptionHandler = function(e, source) {
};
unawaited.unknownValueHandler = function(value, source) {
};
unawaited.alwaysPassExceptionToHandler = true;
export {
  unawaited
};
