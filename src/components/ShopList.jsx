import { useMemo, useState } from 'react'
import ShopCard from './ShopCard.jsx'
import { prefecturesIn } from '../prefectures.js'

const SORTS = {
  rating: { label: '評価が高い順', fn: (a, b) => b.rating - a.rating },
  priceAsc: { label: '安い順', fn: (a, b) => a.price - b.price },
  name: { label: '名前順', fn: (a, b) => a.name.localeCompare(b.name) },
}

export default function ShopList({
  shops,
  tacos,
  favorites,
  onToggleFavorite,
  emptyMessage = '条件に合うお店が見つかりませんでした。',
}) {
  const [query, setQuery] = useState('')
  const [prefecture, setPrefecture] = useState('')
  const [tags, setTags] = useState([])
  const [sort, setSort] = useState('rating')

  const prefectures = useMemo(() => prefecturesIn(shops), [shops])
  const allTags = useMemo(() => [...new Set(shops.flatMap((s) => s.tags))], [shops])
  const tacoById = useMemo(() => Object.fromEntries(tacos.map((t) => [t.id, t])), [tacos])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return shops
      .filter((s) => !prefecture || s.prefecture === prefecture)
      .filter((s) => tags.every((t) => s.tags.includes(t)))
      .filter((s) => {
        if (!q) return true
        const text = [
          s.name,
          s.prefecture,
          s.area,
          s.station,
          s.description,
          ...s.tags,
          ...s.specialties.map((id) => tacoById[id]?.name ?? ''),
        ]
          .join(' ')
          .toLowerCase()
        return text.includes(q)
      })
      .sort(SORTS[sort].fn)
  }, [shops, query, prefecture, tags, sort, tacoById])

  const toggleTag = (tag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))

  return (
    <section>
      <div className="filters">
        <input
          className="search"
          type="search"
          placeholder="店名・エリア・タコスの種類で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="filter-row">
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
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="chips">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={tags.includes(tag) ? 'chip active' : 'chip'}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
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
              tacoById={tacoById}
              isFavorite={favorites.includes(shop.id)}
              onToggleFavorite={() => onToggleFavorite(shop.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
