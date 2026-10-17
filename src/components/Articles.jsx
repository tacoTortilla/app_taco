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


// YouTube はプライバシー強化モード（youtube-nocookie.com）で埋め込む。
// 再生するまで視聴者の閲覧情報を YouTube が Cookie に保存しない
function YouTubeEmbed({ article }) {
  return (
    <iframe
      className="youtube-embed"
      src={`https://www.youtube-nocookie.com/embed/${article.id}`}
      title={article.title}
      loading="lazy"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  )
}

export default function Articles({ articles }) {
  return (
    <section>
      <p className="lead">タコスについての記事や動画。</p>
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article.id}>
            {article.source === 'note' && <NoteEmbed article={article} />}
            {article.source === 'youtube' && <YouTubeEmbed article={article} />}
            <a className="article-link" href={article.url} target="_blank" rel="noreferrer">
              {article.source === 'youtube' ? 'YouTube で見る ↗' : '記事を開く ↗'}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
