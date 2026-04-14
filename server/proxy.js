import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())

// ── Dolar blue ──
app.get('/api/dolar', async (_req, res) => {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/blue')
    if (!response.ok) throw new Error(`dolarapi ${response.status}`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('[dolar]', err.message)
    res.status(502).json({ error: 'Failed to fetch dolar blue' })
  }
})

// ── Crypto prices (CoinGecko) ──
app.get('/api/crypto', async (req, res) => {
  const ids = req.query.ids
  if (!ids) return res.status(400).json({ error: 'Missing ids parameter' })

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`,
    )
    if (!response.ok) throw new Error(`coingecko ${response.status}`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('[crypto]', err.message)
    res.status(502).json({ error: 'Failed to fetch crypto prices' })
  }
})

// ── Crypto price history (CoinGecko) ──
app.get('/api/crypto/history', async (req, res) => {
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
    res.json(data)
  } catch (err) {
    console.error('[crypto/history]', err.message)
    res.status(502).json({ error: 'Failed to fetch price history' })
  }
})

// ── Stock prices (Yahoo Finance) ──
app.get('/api/stock', async (req, res) => {
  const ticker = req.query.ticker
  if (!ticker) return res.status(400).json({ error: 'Missing ticker parameter' })

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    )
    if (!response.ok) throw new Error(`yahoo ${response.status}`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('[stock]', err.message)
    res.status(502).json({ error: 'Failed to fetch stock price' })
  }
})

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})
