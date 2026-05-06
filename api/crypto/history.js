// Crypto price history via CryptoCompare. Free tier, no API key required for
// histoday. Up to ~2000 daily points per call. Pass-through response shape
// preserves Data.Data = [{ time, close, ... }, ...] for the client to normalize.
export default async function handler(req, res) {
  const { symbol, limit } = req.query
  if (!symbol) return res.status(400).json({ error: 'Missing symbol parameter' })

  const lim = Number.parseInt(limit, 10) || 2000
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${encodeURIComponent(symbol.toUpperCase())}&tsym=USD&limit=${lim}`,
    )
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.error(`[crypto/history] CryptoCompare returned ${response.status} for ${symbol}: ${body.slice(0, 200)}`)
      return res.status(response.status).json({ error: `CryptoCompare ${response.status}` })
    }
    const data = await response.json()
    if (data.Response === 'Error') {
      console.error(`[crypto/history] CryptoCompare error for ${symbol}: ${data.Message}`)
      return res.status(502).json({ error: `CryptoCompare: ${data.Message}` })
    }
    res.status(200).json(data)
  } catch (err) {
    console.error('[crypto/history]', err.message)
    res.status(502).json({ error: 'Failed to fetch price history' })
  }
}
