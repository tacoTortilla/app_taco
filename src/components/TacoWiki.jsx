const FIELDS = [
  ['meaning', '名前の意味'],
  ['meat', '使う肉・部位'],
  ['cooking', '作り方'],
  ['origin', '発祥・背景'],
  ['howToEat', '食べ方'],
]

const FOOTER_LINKS = [
  ['トルティーヤ', 'https://note.com/honobonotacos/n/ne38e2f8676c6'],
  ['サルサ', 'https://note.com/honobonotacos/n/n774277dcd31c'],
  ['トッピング', 'https://note.com/honobonotacos/n/nfd90ff07f3e3'],
]

function WikiCard({ item }) {
  return (
    <li className="card wiki-card" id={`wiki-${item.id}`}>
      <div className="card-title">
        <h2>
          {item.emoji} {item.name}
        </h2>
        <span className="meta">{item.nameEs}</span>
      </div>
      {item.image && (
        <img className="wiki-image" src={item.image} alt={`${item.name}のイラスト`} loading="lazy" />
      )}
      <p className="wiki-summary">{item.summary}</p>
      <dl className="wiki-fields">
        {FIELDS.filter(([key]) => item[key]).map(([key, label]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{item[key]}</dd>
          </div>
        ))}
      </dl>
      {item.quote && <blockquote className="wiki-quote">{item.quote}</blockquote>}
      <a className="map-link" href={item.source} target="_blank" rel="noreferrer">
        くわしくは note で ↗
      </a>
    </li>
  )
}

export default function TacoWiki({ wiki }) {
  return (
    <section>
      <p className="lead">メキシコの代表的なタコスの「主役の具」。</p>
      <nav className="wiki-nav" aria-label="タコスの種類">
        {wiki.map((item) => (
          <button
            key={item.id}
            className="wiki-nav-button"
            onClick={() =>
              document.getElementById(`wiki-${item.id}`).scrollIntoView({ behavior: 'smooth' })
            }
          >
            {item.emoji} {item.name}
          </button>
        ))}
      </nav>
      <ul className="shop-list">
        {wiki.map((item) => (
          <WikiCard key={item.id} item={item} />
        ))}
      </ul>
      <p className="wiki-footer">
        {FOOTER_LINKS.map(([label, url], i) => (
          <span key={label}>
            {i > 0 && '、'}
            <a className="text-link" href={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          </span>
        ))}
        に関しては読みものにまとめているのでご参考にしてください
      </p>
    </section>
  )
}
