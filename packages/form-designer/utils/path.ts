/** 按点分路径读取，如 'props.placeholder' / 'formItem.tooltip' / 'label' */
export function getByPath(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj as any)
}

/** 按点分路径写入（原地修改，调用方负责先克隆） */
export function setByPath(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.')
  let target = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof target[keys[i]] !== 'object' || target[keys[i]] === null)
      target[keys[i]] = {}
    target = target[keys[i]]
  }
  target[keys[keys.length - 1]] = value
}
