import { useLayoutEffect, useRef, useState } from 'react'
import { findTaco } from '../tacoLookup.js'

// コメントには必ずこの注意書きを添える（データ側では省略できないようにここで固定）
const COMMENT_NOTE =
  '※ コメントは独自調査によるものです。実際の内容や最新の情報と異なる場合があります。'

// 調査して感じたコメント。長文になりうるので最初は数行だけ見せ、はみ出すときだけ「続きを読む」を出す
function Comment({ text }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (el && !open) setOverflowing(el.scrollHeight > el.clientHeight + 1)
  }, [text, open])

  return (
    <div className="comment">
      <p className="comment-label">💬 コメント</p>
      <p ref={ref} className={open ? 'comment-text' : 'comment-text clamped'}>
        {text}
      </p>
      {(overflowing || open) && (
        <button className="comment-toggle" onClick={() => setOpen((o) => !o)}>
          {open ? '閉じる' : '続きを読む'}
        </button>
      )}
      <p className="comment-note">{COMMENT_NOTE}</p>
    </div>
  )
}

export default function ShopCard({ shop, tacos, isFavorite, onToggleFavorite }) {
  return (
    <li className="card">
      <div className="card-head">
        <div className="card-title">
          <h2>{shop.name}</h2>
          <span className="meta">
            {shop.prefecture} {shop.area}
          </span>
        </div>
        <button
          className={isFavorite ? 'fav active' : 'fav'}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="specialties">
        {shop.tacos.map((name) => (
          <span key={name} className="pill">
            {findTaco(tacos, name)?.emoji ?? '🌮'} {name}
          </span>
        ))}
      </div>

      <div className="card-body">
        {shop.features && <p>{shop.features}</p>}
        {shop.comment && <Comment text={shop.comment} />}
        {shop.access && <p className="access">🚃 {shop.access}</p>}
        {shop.mapUrl && (
          <a className="map-link" href={shop.mapUrl} target="_blank" rel="noreferrer">
            Google マップで見る ↗
          </a>
        )}
      </div>
    </li>
  )
}
