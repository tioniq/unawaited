# Unawaited

**Unawaited** is a utility that allows you to call promises without awaiting them, ensuring that errors are suppressed
and do not cause unhandled rejections. This can be helpful for fire-and-forget operations where you don't need to handle
the promise's outcome.

## Installation

Install the package via npm:

```sh
npm install @tioniq/unawaited
```

## Usage

### Basic usage

When using unawaited, you don't need to await the promise, and it will suppress any errors that occur during the
execution.

```typescript
import '@tioniq/unawaited'

const promise = new Promise((resolve, reject) => {
  reject(new Error('Hello, World!'))
})

unawaited(promise) // No need to await it, no error will be thrown
```

### Function usage

You can also pass a function that returns a promise, and unawaited will call the function and ignore any rejections:

```typescript
import '@tioniq/unawaited'

unawaited(() => Promise.reject(new Error("An error occurred")))
// The promise will reject, but no error will be thrown
```

This pattern is especially useful for handling one-off operations where you don't need to wait for the result.

## License

This project is licensed under the [MIT License](LICENSE).
