import { useMemo, useState } from 'react'
import ShopCard from './ShopCard.jsx'
import { prefecturesIn } from '../prefectures.js'
import { findTaco } from '../tacoLookup.js'

export default function ShopList({
  shops,
  tacos,
  favorites,
  onToggleFavorite,
  emptyMessage = '条件に合うお店が見つかりませんでした。',
}) {
  const [query, setQuery] = useState('')
  const [prefecture, setPrefecture] = useState('')

  const prefectures = useMemo(() => prefecturesIn(shops), [shops])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return shops
      .filter((s) => !prefecture || s.prefecture === prefecture)
      .filter((s) => {
        if (!q) return true
        const text = [
          s.name,
          s.prefecture,
          s.area,
          s.features,
          s.comment,
          s.access,
          ...s.tacos,
          // 「アル・パストール」のような正式表記でも見つかるようにする
          ...s.tacos.map((name) => findTaco(tacos, name)?.name ?? ''),
        ]
          .join(' ')
          .toLowerCase()
        return text.includes(q)
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
  }, [shops, query, prefecture, tacos])

  return (
    <section>
      <div className="filters">
        <input
          className="search"
          type="search"
          placeholder="店名・エリア・駅・タコスの種類で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          aria-label="都道府県"
        >
          <option value="">すべての都道府県</option>
          {prefectures.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <p className="count">{filtered.length} 件</p>

      {filtered.length === 0 ? (
        <p className="empty">{emptyMessage}</p>
      ) : (
        <ul className="shop-list">
          {filtered.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              tacos={tacos}
              isFavorite={favorites.includes(shop.id)}
              onToggleFavorite={() => onToggleFavorite(shop.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
