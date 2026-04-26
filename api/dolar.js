export default async function handler(_req, res) {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/blue')
    if (!response.ok) throw new Error(`dolarapi ${response.status}`)
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    console.error('[dolar]', err.message)
    res.status(502).json({ error: 'Failed to fetch dolar blue' })
  }
}
