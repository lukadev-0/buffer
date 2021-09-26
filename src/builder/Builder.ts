export class BufferBuilder {
  public steps: BufferBuildStep<unknown>[] = []

  constructor(protected size: number) {}

  /**
   * Adds a step
   */
  addStep<T>(type: BufferBuildStepType, data: T): this {
    this.steps.push({
      type,
      data,
    })

    return this
  }

  /**
   * Creates a buffer using the {@link BufferBuilder.steps | steps}.
   * @returns the built buffer
   */
  build(): Buffer {
    const buf = Buffer.alloc(this.size)

    let offset = 0
    for (const { type, data } of this.steps) {
      offset = bufferSteps[type](buf, data, offset) ?? offset
    }

    return buf
  }

  write(value: string | ArrayLike<number>): this {
    if (typeof value === 'string') {
      return this.addStep(BufferBuildStepType.WriteString, value)
    }

    return this.addStep(BufferBuildStepType.WriteValue, value)
  }
}

/**
 * Represents the type of a {@link BufferBuildStep | build step}.
 * @public
 */
export enum BufferBuildStepType {
  WriteString = 'WRITE_STRING',
  WriteValue = 'WRITE_VALUE',
}

/**
 * Represents a build step in a buffer
 * @public
 */
export interface BufferBuildStep<T> {
  type: BufferBuildStepType
  data: T
}

const bufferSteps: Record<
  BufferBuildStepType,
  (buf: Buffer, data: unknown, offset: number) => void | number
> = {
  [BufferBuildStepType.WriteString]: (buf, data, offset) => {
    return offset + buf.write(data as string, offset)
  },

  [BufferBuildStepType.WriteValue]: (buf, data, offset) => {
    const arr = data as number[]
    buf.set(arr, offset)
    return offset + arr.length
  },
}
