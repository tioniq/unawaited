# Unawaited

**Unawaited** is a utility that allows you to call promises without awaiting them, ensuring that errors are suppressed
and do not cause unhandled promise rejections. This can be helpful for fire-and-forget operations where you don't need
to handle the promise's outcome.

## Installation

Install the package via npm:

```sh
npm install @tioniq/unawaited
```

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Function Usage](#function-usage)
    - [Error Handling](#error-handling)
    - [General Error Handling](#general-error-handling)
    - [Handle Unknown Argument](#handle-unknown-argument)
    - [Bad Usage](#bad-usage)
- [License](#license)

## Usage

### Basic Usage

When using `unawaited`, you don't need to await the promise, and it will suppress any errors that occur during the
execution

```typescript
import { unawaited } from '@tioniq/unawaited'

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('Hello, World!'))
  }, 1000)
})

unawaited(promise) // No need to await it, no error will be thrown
```

### Function Usage

You can also pass a function that returns a promise, and `unawaited` will call the function and ignore any rejections:

```typescript
import { unawaited } from '@tioniq/unawaited'

unawaited(() => Promise.reject(new Error("An error occurred")))
// The promise will reject, but no error will be thrown

unawaited(() => {
  throw new Error("An error occurred")
})
// Or even throw an error directly
```

### Error Handling

If you want to handle errors that occur during the promise execution, you can pass a second argument to the `unawaited`
function:

```typescript
import { unawaited } from '@tioniq/unawaited'

const promise = new Promise((resolve, reject) => {
  reject(new Error('Hello, World!'))
})

unawaited(promise, (error) => {
  console.error(error.message) // Prints "Hello, World!"
})
```

### General Error Handling

If you want to handle all errors that occur during the promise execution on global level, you can set the
`unawaited.exceptionHandler` property. It will be called with the error and the source object (if provided):

```typescript
import { unawaited } from '@tioniq/unawaited'

// Set global exception handler
unawaited.exceptionHandler = (error, source) => {
  console.error(`Unhandled exception "${error.message}" in source ${source}`)
}

// Some source object, for example the string. Can be omitted.
const source = "hello"

unawaited(() => throw new Error("Hello, World!"), source) // Prints "Unhandled exception "Hello, World!" in source hello"
```

By default, the `unawaited.exceptionHandler` is set to noop.

### Handle Unknown Argument

If `unawaited` is called with an argument that is not a promise or a function, it will call the exception handler with
an error:

```typescript
import { unawaited } from '@tioniq/unawaited'

unawaited.unknownValueHandler = (value) => {
  console.error(`Unknown value "${value}"`)
}

unawaited('Hello, World!') // Prints "Unknown value "Hello, World!"
```

By default, the `unawaited.unknownValueHandler` is set to noop.

### Bad Usage

```typescript
import { unawaited } from '@tioniq/unawaited'

async function badFunction() {
  if (true) {
    throw new Error('Hello, World!')
  }
  // Do something
}

unawaited(badFunction()) // Will throw an error, because the function execution is not wrapped in a try-catch block

// Do instead
unawaited(badFunction) // Will call the function and handle the error
// Or
unawaited(() => badFunction()) // Will call the function and handle the error
```

This pattern is especially useful for handling one-off operations where you don't need to wait for the result.

## License

This project is licensed under the [MIT License](LICENSE).
