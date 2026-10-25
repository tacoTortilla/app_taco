// データ取得はすべてここを経由させる。
// 今はローカルの JSON を返しているが、サーバ版では fetch('/api/shops') などに差し替えるだけで済む。
import shops from './data/shops.json'
import tacos from './data/tacos.json'
import articles from './data/articles.json'
import wiki from './data/wiki.json'

export async function fetchShops() {
  return shops
}

export async function fetchTacos() {
  return tacos
}

export async function fetchArticles() {
  return articles
}

export async function fetchWiki() {
  return wiki
}
