type PromiseOrNothing = Promise<any> | PromiseLike<any> | undefined | null | void;
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
declare function unawaited(promiseOrFunction: (() => PromiseOrNothing) | PromiseOrNothing, source?: any): void;
declare namespace unawaited {
    var exceptionHandler: (e: any, source: any) => void;
    var unknownValueHandler: (value: any, source: any) => void;
}

export { unawaited };
