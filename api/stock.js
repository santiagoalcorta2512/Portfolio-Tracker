export default async function handler(req, res) {
  const ticker = req.query.ticker
  if (!ticker) return res.status(400).json({ error: 'Missing ticker parameter' })

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    )
    if (!response.ok) throw new Error(`yahoo ${response.status}`)
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    console.error('[stock]', err.message)
    res.status(502).json({ error: 'Failed to fetch stock price' })
  }
}
