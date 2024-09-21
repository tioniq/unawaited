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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  unawaited
});
