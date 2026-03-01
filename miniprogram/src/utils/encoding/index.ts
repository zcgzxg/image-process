/**
 * 使用 utf-8 工具模拟 TextEncoder / TextDecoder API
 * 用于不支持原生 Text Encoding API 的环境（如部分小程序运行时）
 */
import { getBytesForCharCode, getStringFromBytes, setBytesFromString } from '@/utils/utf-8'

/**
 * 计算字符串 UTF-8 编码后的字节长度
 */
function getUtf8ByteLength(str: string): number {
  let length = 0
  for (let i = 0; i < str.length; i++) {
    length += getBytesForCharCode(str.codePointAt(i) ?? 0)
    if ((str.codePointAt(i) ?? 0) > 0xffff) {
      i++ // 跳过代理对中的第二个码元
    }
  }
  return length
}

/** TextEncoder 的 polyfill 实现 */
export class TextEncoder {
  readonly encoding = 'utf-8'

  /**
   * 将字符串编码为 UTF-8 字节序列
   */
  encode(input = ''): Uint8Array {
    const byteLength = getUtf8ByteLength(input)
    const bytes = new Uint8Array(byteLength)
    setBytesFromString(input, bytes, 0, byteLength, false)
    return bytes
  }
}

/** TextDecoder 的 polyfill 实现 */
export class TextDecoder {
  readonly encoding = 'utf-8'
  readonly fatal: boolean
  readonly ignoreBOM: boolean

  constructor(_label?: string, options?: { fatal?: boolean; ignoreBOM?: boolean }) {
    this.fatal = options?.fatal ?? false
    this.ignoreBOM = options?.ignoreBOM ?? false
  }

  /**
   * 将 UTF-8 字节序列解码为字符串
   */
  decode(input?: ArrayBuffer | ArrayBufferView): string {
    if (input == null) {
      return ''
    }

    let bytes: Uint8Array
    if (input instanceof Uint8Array) {
      bytes = input
    } else if (input instanceof ArrayBuffer) {
      bytes = new Uint8Array(input)
    } else {
      const buf = input as ArrayBufferView
      bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
    }

    const strict = this.fatal
    let result = getStringFromBytes(bytes, 0, bytes.length, strict)

    // 若启用 ignoreBOM，移除开头的 BOM (U+FEFF)
    if (this.ignoreBOM && result.startsWith('\uFEFF')) {
      result = result.slice(1)
    }

    return result
  }
}
