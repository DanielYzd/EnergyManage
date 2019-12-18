// 换肤加class函数
export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  console.log(className)
  element.className = className
}
