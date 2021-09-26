import { BufferBuilder } from '../Builder'

describe('class BufferBuilder', () => {
  describe('build()', () => {
    it('returns an empty buffer', () => {
      const buf = new BufferBuilder(20).build()

      expect(buf).toEqual(Buffer.alloc(20))
    })
  })

  describe('write()', () => {
    it('writes a value to the buffer', () => {
      const values = [1]
      const buf = new BufferBuilder(1).write(values).build()

      expect(buf).toEqual(Buffer.from(values))
    })

    it('writes multiple values to the buffer', () => {
      const values = [1, 2, 3, 4, 5]
      const buf = new BufferBuilder(5).write(values).build()

      expect(buf).toEqual(Buffer.from(values))
    })

    it('writes the next value after the first value', () => {
      const values1 = [1, 2, 3, 4, 5]
      const values2 = [6, 7, 8, 9, 10]

      const buf = new BufferBuilder(10).write(values1).write(values2).build()

      expect(buf).toEqual(Buffer.from([...values1, ...values2]))
    })

    it('writes a string to the buffer', () => {
      const buf = new BufferBuilder(12).write('Hello World!').build()

      expect(buf).toEqual(Buffer.from('Hello World!'))
    })

    it('writes the next string after the first string', () => {
      const buf = new BufferBuilder(25)
        .write('Hello World!')
        .write('\n')
        .write('Hello World!')
        .build()

      expect(buf).toEqual(Buffer.from('Hello World!\nHello World!'))
    })

    it('writes 5 after the string', () => {
      const buf = new BufferBuilder(6).write('Hello').write([5]).build()

      const target = Buffer.allocUnsafe(6)
      target.write('Hello')
      target.set([5], 5)

      expect(buf).toEqual(target)
    })
  })
})
