export default async function handler(req, res) {
  const ids = req.query.ids
  if (!ids) return res.status(400).json({ error: 'Missing ids parameter' })

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`,
    )
    if (!response.ok) throw new Error(`coingecko ${response.status}`)
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    console.error('[crypto]', err.message)
    res.status(502).json({ error: 'Failed to fetch crypto prices' })
  }
}
