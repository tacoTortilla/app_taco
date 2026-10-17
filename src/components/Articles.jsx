import { useEffect, useState } from 'react'

// note の記事ページ本体は外部サイトでの埋め込みを禁止しているため、
// note 公式の埋め込みカード（/embed/notes/:id）を表示する
function NoteEmbed({ article }) {
  const src = `https://note.com/embed/notes/${article.id}`
  const [height, setHeight] = useState(224)

  // カードは "height::<src>::<px>" を postMessage で知らせてくる（note の embed.js と同じ仕組み）。
  // 外部スクリプトは読み込まず、note.com からのメッセージだけを受け付けて高さを合わせる
  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== 'https://note.com' || typeof event.data !== 'string') return
      const [type, from, px] = event.data.split('::')
      const next = parseInt(px, 10)
      if (type === 'height' && from === src && next > 0 && next < 2000) setHeight(next)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [src])

  return (
    <iframe
      className="note-embed"
      src={src}
      title={article.title}
      height={height}
      scrolling="no"
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  )
}


export default function Articles({ articles }) {
  return (
    <section>
      <p className="lead">タコスについての読みもの。カードを押すと記事が開きます。</p>
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article.id}>
            {article.source === 'note' && <NoteEmbed article={article} />}
            <a className="article-link" href={article.url} target="_blank" rel="noreferrer">
              記事を開く ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
