import {unawaited} from "../src";

describe('unawaited unsupported types', () => {
  it('null', () => {
    unawaited(null)
  })
  it('undefined', () => {
    unawaited(undefined)
  })
  it('void', () => {
    unawaited(void 0)
  })
  it('empty object', () => {
    unawaited({} as any)
  })
  it('empty array', () => {
    unawaited([] as any)
  })
  it('empty string', () => {
    unawaited('' as any)
  })
})

describe('unawaited real promise', () => {
  it('should not throw', () => {
    unawaited(new Promise(() => {
      throw new Error('error')
    }))
  })

  it('should not throw rejected', () => {
    unawaited(new Promise((_, reject) => {
      reject(new Error('error'))
    }))
  })

  it('should not throw resolved', () => {
    unawaited(Promise.resolve())
  })

  it('should not throw rejected 2', () => {
    unawaited(Promise.reject(new Error('error')))
  })

  it('should not throw on bad promise', () => {
    const promise = new Promise(() => {

    })
    promise.catch = null as any
    unawaited(promise)
  })

  it('should resolve timeout', async () => {
    jest.useFakeTimers()
    let resolved = false
    unawaited(new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
        resolved = true
      }, 100)
    }))
    expect(resolved).toBe(false)
    jest.advanceTimersByTime(100)
    expect(resolved).toBe(true)
  })

  it('should reject timeout', async () => {
    jest.useFakeTimers()
    let rejected = false
    unawaited(new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error('error'))
        rejected = true
      }, 100)
    }))
    expect(rejected).toBe(false)
    jest.advanceTimersByTime(100)
    expect(rejected).toBe(true)
  })
})

describe('unawaited promise like', () => {
  it('should not throw', () => {
    unawaited({
      then: () => {
        throw new Error('error')
      }
    })
  })

  it('should not throw resolved', () => {
    unawaited({
      then: () => {
        return {} as any
      }
    })
  })

  it('should not throw catch', () => {
    unawaited({
      then: () => {
        return {} as any
      },
      catch: () => {
        throw new Error('error')
      }
    })
  })

  it('should not throw catch resolved', () => {
    unawaited({
      then: () => {
        return {} as any
      },
      catch: () => {
        return {} as any
      }
    })
  })

  it('should not throw catch rejected', () => {
    let like: PromiseLike<void> = {
      then<TResult1 = void, TResult2 = never>(_?: ((value: void) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onRejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): PromiseLike<TResult1 | TResult2> {
        onRejected!(new Error('error'))
        return {} as any
      }
    }
    unawaited(like)
  })
})

describe('unawaited function', () => {
  it('should not throw', () => {
    unawaited(() => {
      throw new Error('error')
    })
  })

  it('should not throw resolved', () => {
    unawaited(() => {
      return Promise.resolve()
    })
  })

  it('should not throw rejected', () => {
    unawaited(() => {
      return Promise.reject(new Error('error'))
    })
  })

  it('should not throw timeout', () => {
    jest.useFakeTimers()
    let resolved = false
    unawaited(() => new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
        resolved = true
      }, 100)
    }))
    expect(resolved).toBe(false)
    jest.advanceTimersByTime(100)
    expect(resolved).toBe(true)
  })

  it('should not throw timeout rejected', () => {
    jest.useFakeTimers()
    let rejected = false
    unawaited(() => new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error('error'))
        rejected = true
      }, 100)
    }))
    expect(rejected).toBe(false)
    jest.advanceTimersByTime(100)
    expect(rejected).toBe(true)
  })

  it('should not throw promise like', () => {
    unawaited(() => {
      return {
        then: () => {
          throw new Error('error')
        }
      }
    })
  })
})

describe('should pass source', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })
  it('should pass source', async () => {
    const source = Symbol('source')
    const handler = unawaited.exceptionHandler = jest.fn()
    unawaited(() => Promise.reject(new Error("error")), source)
    await jest.runAllTimersAsync()
    expect(handler).toHaveBeenCalledWith(expect.any(Error), source)
  })
  it('should pass source 2', async () => {
    const source = Symbol('source')
    const obj = {}
    const handler = unawaited.unknownValueHandler = jest.fn()
    unawaited(obj as any, source)
    await jest.runAllTimersAsync()
    expect(handler).toHaveBeenCalledWith(obj, source)
  })
})