// 店舗データのタコス名（自由入力）を tacos.json の種類に結び付ける。
// 「アルパストール」と「アル・パストール」、「アサダ」と「カルネ・アサダ」のような表記ゆれを吸収する
const normalize = (s) => s.replace(/[・･\s]/g, '')

export function findTaco(tacos, name) {
  const n = normalize(name)
  if (!n) return undefined
  return (
    tacos.find((t) => normalize(t.name) === n) ??
    tacos.find((t) => normalize(t.name).endsWith(n) || n.endsWith(normalize(t.name)))
  )
}
