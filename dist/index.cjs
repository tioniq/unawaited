"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  unawaited: () => unawaited
});
module.exports = __toCommonJS(src_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  unawaited
});
