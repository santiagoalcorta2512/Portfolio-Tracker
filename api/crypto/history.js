export default async function handler(req, res) {
  const { id, days } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id parameter' })

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days || 'max'}`,
    )
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.error(`[crypto/history] CoinGecko returned ${response.status} for ${id}: ${body.slice(0, 200)}`)
      return res.status(response.status).json({ error: `CoinGecko ${response.status}` })
    }
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    console.error('[crypto/history]', err.message)
    res.status(502).json({ error: 'Failed to fetch price history' })
  }
}
