// src/index.ts
function unawaited(promiseOrFunction, source) {
  if (!promiseOrFunction) {
    return;
  }
  if (promiseOrFunction instanceof Promise) {
    handlePromise(promiseOrFunction, source);
    return;
  }
  if (typeof promiseOrFunction !== "function") {
    if (typeof promiseOrFunction === "object") {
      if (typeof promiseOrFunction.then === "function") {
        handlePromiseLike(promiseOrFunction, source);
        return;
      }
    }
    unawaited.unknownValueHandler(promiseOrFunction, source);
    return;
  }
  let result;
  try {
    result = promiseOrFunction();
  } catch (e) {
    unawaited.exceptionHandler(e, source);
  }
  if (result instanceof Promise) {
    handlePromise(result, source);
    return;
  }
  if (typeof result === "object") {
    if (typeof result.then === "function") {
      handlePromiseLike(result, source);
    }
  }
}
function handlePromise(promise, source) {
  try {
    promise.catch((e) => unawaited.exceptionHandler(e, source));
  } catch (e) {
    unawaited.exceptionHandler(e, source);
  }
}
function handlePromiseLike(promiseLike, source) {
  try {
    Promise.resolve(promiseLike).catch((e) => unawaited.exceptionHandler(e, source));
  } catch (e) {
    unawaited.exceptionHandler(e, source);
  }
}
unawaited.exceptionHandler = function(e, source) {
};
unawaited.unknownValueHandler = function(value, source) {
};
export {
  unawaited
};
