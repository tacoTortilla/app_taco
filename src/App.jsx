import { useEffect, useState } from 'react'
import { fetchArticles, fetchShops, fetchTacos } from './api.js'
import { useLocalStorage } from './useLocalStorage.js'
import ShopList from './components/ShopList.jsx'
import Articles from './components/Articles.jsx'

const TABS = [
  { id: 'shops', label: 'お店を探す', icon: '📍' },
  { id: 'favorites', label: 'お気に入り', icon: '★' },
  { id: 'articles', label: '読みもの', icon: '📰' },
]

export default function App() {
  const [tab, setTabState] = useState('shops')
  const [shops, setShops] = useState([])
  const [tacos, setTacos] = useState([])
  const [articles, setArticles] = useState([])
  const [favorites, setFavorites] = useLocalStorage('taco:favorites', [])

  useEffect(() => {
    fetchShops().then(setShops)
    fetchTacos().then(setTacos)
    fetchArticles().then(setArticles)
  }, [])

  // 下部タブで切り替えたとき、前の画面のスクロール位置のままにならないようにする
  const setTab = (next) => {
    setTabState(next)
    window.scrollTo(0, 0)
  }

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  return (
    <div className="app">
      <header className="header">
        <h1>🌮 Taco Navi</h1>
        <p className="subtitle">タコスのお店と情報をまとめてチェック</p>
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
            {t.id === 'favorites' && favorites.length > 0 && (
              <span className="badge">{favorites.length}</span>
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
        {tab === 'articles' && <Articles articles={articles} />}
        {tab === 'favorites' && (
          <ShopList
            shops={shops.filter((s) => favorites.includes(s.id))}
            tacos={tacos}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            emptyMessage="まだお気に入りがありません。お店の ☆ をタップして追加しましょう。"
          />
        )}
      </main>

      <footer className="footer">※ 掲載店舗はサンプルデータです</footer>
    </div>
  )
}
