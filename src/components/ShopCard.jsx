import { useState } from 'react'

export default function ShopCard({ shop, tacoById, isFavorite, onToggleFavorite }) {
  const [open, setOpen] = useState(false)

  return (
    <li className="card">
      <div className="card-head">
        <button className="card-title" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <h2>{shop.name}</h2>
          <span className="meta">
            {shop.area} · {'¥'.repeat(shop.price)} · ⭐ {shop.rating.toFixed(1)}
          </span>
        </button>
        <button
          className={isFavorite ? 'fav active' : 'fav'}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="specialties">
        {shop.specialties.map((id) =>
          tacoById[id] ? (
            <span key={id} className="pill">
              {tacoById[id].emoji} {tacoById[id].name}
            </span>
          ) : null,
        )}
      </div>

      {open && (
        <div className="card-body">
          <p>{shop.description}</p>
          <dl>
            <dt>アクセス</dt>
            <dd>{shop.station}</dd>
            <dt>営業時間</dt>
            <dd>{shop.hours}</dd>
            <dt>定休日</dt>
            <dd>{shop.closed}</dd>
          </dl>
          <div className="tags">
            {shop.tags.map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>
          {shop.mapUrl && (
            <a className="map-link" href={shop.mapUrl} target="_blank" rel="noreferrer">
              地図で見る ↗
            </a>
          )}
        </div>
      )}
    </li>
  )
}
