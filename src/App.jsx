import { useEffect, useState } from 'react'
import { fetchArticles, fetchShops, fetchTacos, fetchWiki } from './api.js'
import { useLocalStorage } from './useLocalStorage.js'
import ShopList from './components/ShopList.jsx'
import Articles from './components/Articles.jsx'
import TacoWiki from './components/TacoWiki.jsx'

// お気に入りの旧保存形式からの移行（一度だけ）。
// TAQUITO 新小岩の ID を tokyo-0001 → tokyo-0009（Notion のタコス屋メモ番号）に変えたため、
// 旧IDのまま残すと、後で tokyo-0001 になる別のお店がお気に入りに出てしまう
function migrateFavorites() {
  try {
    const old = JSON.parse(localStorage.getItem('taco:favorites') ?? '[]')
    return [...new Set(old.map((id) => (id === 'tokyo-0001' ? 'tokyo-0009' : id)))]
  } catch {
    return []
  }
}

const TABS = [
  { id: 'shops', label: 'お店を探す', icon: '📍' },
  { id: 'favorites', label: 'お気に入り', icon: '★' },
  { id: 'wiki', label: 'タコスwiki', icon: '📖' },
  { id: 'articles', label: '読みもの', icon: '📰' },
]

export default function App() {
  const [tab, setTabState] = useState('shops')
  const [shops, setShops] = useState([])
  const [tacos, setTacos] = useState([])
  const [articles, setArticles] = useState([])
  const [wiki, setWiki] = useState([])
  const [favorites, setFavorites] = useLocalStorage('taco:favorites:v2', migrateFavorites)

  useEffect(() => {
    fetchShops().then(setShops)
    fetchTacos().then(setTacos)
    fetchArticles().then(setArticles)
    fetchWiki().then(setWiki)
  }, [])

  // 下部タブで切り替えたとき、前の画面のスクロール位置のままにならないようにする
  const setTab = (next) => {
    setTabState(next)
    window.scrollTo(0, 0)
  }

  const favoriteShops = shops.filter((s) => favorites.includes(s.id))

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  return (
    <div className="app">
      <header className="header">
        <h1>🌮 Taco Navi</h1>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'tab active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            {t.label}
            {t.id === 'favorites' && favoriteShops.length > 0 && (
              <span className="badge">{favoriteShops.length}</span>
            )}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'shops' && (
          <ShopList
            shops={shops}
            tacos={tacos}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
        {tab === 'wiki' && <TacoWiki wiki={wiki} />}
        {tab === 'articles' && <Articles articles={articles} />}
        {tab === 'favorites' && (
          <ShopList
            shops={favoriteShops}
            tacos={tacos}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            emptyMessage="まだお気に入りがありません。お店の ☆ をタップして追加しましょう。"
          />
        )}
      </main>
    </div>
  )
}
