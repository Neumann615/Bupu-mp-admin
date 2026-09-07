let seq = 0

/** 生成短唯一 id，用于字段 id 与 field 名 */
export function uniqueId(prefix = 'f'): string {
  seq = (seq + 1) % 1296
  return `${prefix}${Date.now().toString(36)}${seq.toString(36)}`
}
