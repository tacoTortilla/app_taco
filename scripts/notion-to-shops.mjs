// Notion「タコス店リスト」の行（公開 = ☑ のもの）を src/data/shops.json に変換する。
// 使い方: node scripts/notion-to-shops.mjs <rows.json> [--write]
//   rows.json … Notion から取得した行の配列（列名は Notion のまま）
//   --write   … 付けたときだけ shops.json を書き換える（付けなければ差分の表示だけ）
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PREFECTURES } from '../src/prefectures.js'

const SHOPS_PATH = fileURLToPath(new URL('../src/data/shops.json', import.meta.url))
const [rowsPath, flag] = process.argv.slice(2)
if (!rowsPath) {
  console.error('使い方: node scripts/notion-to-shops.mjs <rows.json> [--write]')
  process.exit(1)
}

// Notion の改行（Shift+Enter）は取得方法により "\n" か "<br />" で届くので "\n" にそろえる
const text = (v) => (typeof v === 'string' ? v.replace(/<br\s*\/?>/gi, '\n').replace(/\r\n?/g, '\n').trim() : '')
const list = (v) => {
  if (Array.isArray(v)) return v
  try {
    return JSON.parse(v ?? '[]')
  } catch {
    return []
  }
}

const errors = []
const rows = JSON.parse(readFileSync(rowsPath, 'utf8')).filter((r) => r['公開'] === '__YES__' || r['公開'] === true)

const shops = rows.map((r) => {
  const shop = {
    id: text(r['userDefined:ID'] ?? r['ID']),
    name: text(r['店名']),
    prefecture: text(r['都道府県']),
    area: text(r['エリア']),
    tacos: list(r['タコス']).map(text).filter(Boolean),
    features: text(r['特徴']),
    comment: text(r['コメント']),
    access: text(r['最寄り駅ルート']),
    mapUrl: text(r['Google Map']),
  }
  const label = shop.name || shop.id || '(名前なし)'
  if (!/^[a-z]+-\d{4}$/.test(shop.id)) errors.push(`${label}: ID「${shop.id}」が「tokyo-0009」の形ではありません`)
  if (!shop.name) errors.push(`${label}: 店名が空です`)
  if (!PREFECTURES.includes(shop.prefecture)) errors.push(`${label}: 都道府県「${shop.prefecture}」が正式名ではありません`)
  if (shop.tacos.length === 0) errors.push(`${label}: タコスが空です`)
  if (shop.mapUrl && !/^https:\/\//.test(shop.mapUrl)) errors.push(`${label}: Google Map が https:// で始まっていません`)
  // 空の任意項目はデータに含めない
  if (!shop.comment) delete shop.comment
  return shop
})

const seen = new Set()
for (const s of shops) {
  if (seen.has(s.id)) errors.push(`ID「${s.id}」が重複しています`)
  seen.add(s.id)
}
shops.sort((a, b) => a.id.localeCompare(b.id))

// 今のデータとの差分
const current = JSON.parse(readFileSync(SHOPS_PATH, 'utf8'))
const byId = (arr) => Object.fromEntries(arr.map((s) => [s.id, s]))
const before = byId(current)
const after = byId(shops)
const added = shops.filter((s) => !before[s.id])
const removed = current.filter((s) => !after[s.id])
const changed = shops.filter((s) => before[s.id] && JSON.stringify(before[s.id]) !== JSON.stringify(s))

console.log(`公開中: ${shops.length} 店`)
for (const s of added) console.log(`  ＋ 追加  ${s.id} ${s.name}`)
for (const s of removed) console.log(`  － 削除  ${s.id} ${s.name}`)
for (const s of changed) {
  const keys = Object.keys({ ...before[s.id], ...s }).filter(
    (k) => JSON.stringify(before[s.id][k]) !== JSON.stringify(s[k]),
  )
  console.log(`  ✎ 変更  ${s.id} ${s.name}（${keys.join(', ')}）`)
  for (const k of keys) console.log(`      ${k}: ${JSON.stringify(before[s.id][k])} → ${JSON.stringify(s[k])}`)
}
if (!added.length && !removed.length && !changed.length) console.log('  変更なし')

if (errors.length) {
  console.error('\n要確認:')
  for (const e of errors) console.error(`  ⚠ ${e}`)
  process.exit(2)
}

if (flag === '--write') {
  writeFileSync(SHOPS_PATH, JSON.stringify(shops, null, 2) + '\n')
  console.log('\nshops.json を更新しました')
}
