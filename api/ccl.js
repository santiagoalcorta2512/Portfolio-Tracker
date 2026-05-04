export default async function handler(_req, res) {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/contadoconliqui')
    if (!response.ok) throw new Error(`dolarapi ${response.status}`)
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    console.error('[ccl]', err.message)
    res.status(502).json({ error: 'Failed to fetch dolar CCL' })
  }
}
