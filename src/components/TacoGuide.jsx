export default function TacoGuide({ tacos, shops, onSelect }) {
  return (
    <section>
      <p className="lead">代表的なタコスの種類。カードを押すと、そのタコスが食べられるお店を探せます。</p>
      <ul className="taco-grid">
        {tacos.map((taco) => {
          const count = shops.filter((s) => s.specialties.includes(taco.id)).length
          return (
            <li key={taco.id}>
              <button className="taco-card" onClick={() => onSelect(taco.id)}>
                <span className="taco-emoji">{taco.emoji}</span>
                <h2>{taco.name}</h2>
                <p className="taco-es">{taco.nameEs}</p>
                <p className="taco-region">
                  📍 {taco.region} · {'🌶'.repeat(taco.spicy)}
                </p>
                <p className="taco-desc">{taco.description}</p>
                <span className="taco-count">{count} 店舗 →</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
