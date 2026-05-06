import { useState, useEffect, useCallback, useRef } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import './App.css'

// ── Constants ──

const BLUE_FALLBACK = 1200
const CCL_FALLBACK = 1300
const API_BASE = '/api'

const CRYPTO_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  SHIB: 'shiba-inu',
  LTC: 'litecoin',
  BNB: 'binancecoin',
  NEAR: 'near',
  ARB: 'arbitrum',
  OP: 'optimism',
  AAVE: 'aave',
  USDT: 'tether',
  USDC: 'usd-coin',
  RON: 'ronin',
}

const ASSET_COLORS = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  BNB: '#F3BA2F',
  RON: '#1273EA',
  META: '#0668E1',
  MSFT: '#00A4EF',
  NU: '#9B4DFF',
  MELI: '#FFE600',
}

const ACCENT = '#7C9BFF'
const MUTE = '#52525B'
const LINE = '#1F1F24'

const TYPE_BORDER = {
  crypto: '#F7931A',
  cedear: '#7C9BFF',
  accion: '#a78bfa',
  bono: '#22d3ee',
  fci: '#f472b6',
}

const TYPE_LABELS = {
  crypto: 'CRYPTO',
  cedear: 'CEDEARs',
  accion: 'ACCIONES',
  bono: 'BONOS',
  fci: 'FCI',
}

const CEDEAR_RATIO = {
  META: 23,
  MSFT: 30,
  NU: 2,
  MELI: 120,
}

const INITIAL_TRANSACTIONS = [
  // BTC
  { id: 1, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.00202609, unitPrice: 36600, date: '2022-02-22T12:00:00.000Z' },
  { id: 2, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.00195446, unitPrice: 37300, date: '2022-02-23T12:00:00.000Z' },
  { id: 3, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.00051, unitPrice: 39000, date: '2022-03-04T12:00:00.000Z' },
  { id: 4, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.00277, unitPrice: 36030, date: '2022-05-06T12:00:00.000Z' },
  { id: 5, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.01454, unitPrice: 18863, date: '2022-06-30T12:00:00.000Z' },
  { id: 6, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.0044, unitPrice: 22000, date: '2022-08-29T12:00:00.000Z' },
  { id: 7, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.002476341, unitPrice: 63400, date: '2024-04-27T12:00:00.000Z' },
  { id: 8, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.00204, unitPrice: 98422, date: '2025-11-13T12:00:00.000Z' },
  { id: 9, ticker: 'BTC', assetType: 'crypto', operation: 'buy', quantity: 0.00523476, unitPrice: 65415, date: '2026-02-27T12:00:00.000Z' },
  // BNB
  { id: 10, ticker: 'BNB', assetType: 'crypto', operation: 'buy', quantity: 0.02704896, unitPrice: 600, date: '2021-11-10T12:00:00.000Z' },
  { id: 11, ticker: 'BNB', assetType: 'crypto', operation: 'buy', quantity: 0.11855104, unitPrice: 537, date: '2021-12-29T12:00:00.000Z' },
  { id: 12, ticker: 'BNB', assetType: 'crypto', operation: 'buy', quantity: 0.11190347, unitPrice: 478, date: '2022-01-06T12:00:00.000Z' },
  { id: 13, ticker: 'BNB', assetType: 'crypto', operation: 'buy', quantity: 0.2077922, unitPrice: 461, date: '2022-01-18T12:00:00.000Z' },
  { id: 14, ticker: 'BNB', assetType: 'crypto', operation: 'buy', quantity: 0.553187773, unitPrice: 229, date: '2022-06-23T12:00:00.000Z' },
  { id: 15, ticker: 'BNB', assetType: 'crypto', operation: 'buy', quantity: 0.02474733, unitPrice: 593, date: '2024-04-05T12:00:00.000Z' },
  // ETH
  { id: 16, ticker: 'ETH', assetType: 'crypto', operation: 'buy', quantity: 0.025, unitPrice: 3800, date: '2021-12-28T12:00:00.000Z' },
  // RON
  { id: 17, ticker: 'RON', assetType: 'crypto', operation: 'buy', quantity: 13.85, unitPrice: 2.40, date: '2024-06-20T12:00:00.000Z' },
  { id: 18, ticker: 'RON', assetType: 'crypto', operation: 'buy', quantity: 31.96, unitPrice: 2.19, date: '2024-06-25T12:00:00.000Z' },
  { id: 19, ticker: 'RON', assetType: 'crypto', operation: 'buy', quantity: 17.48, unitPrice: 1.72, date: '2024-07-08T12:00:00.000Z' },
  // CEDEARs
  { id: 20, ticker: 'META', assetType: 'cedear', operation: 'buy', quantity: 12, unitPrice: 24.72, date: '2026-04-07T12:00:00.000Z' },
  { id: 21, ticker: 'META', assetType: 'cedear', operation: 'buy', quantity: 13, unitPrice: 25.32, date: '2026-04-07T12:00:00.000Z' },
  { id: 22, ticker: 'MSFT', assetType: 'cedear', operation: 'buy', quantity: 27, unitPrice: 12.86, date: '2026-04-07T12:00:00.000Z' },
  { id: 23, ticker: 'MSFT', assetType: 'cedear', operation: 'buy', quantity: 28, unitPrice: 13.19, date: '2026-04-07T12:00:00.000Z' },
  { id: 24, ticker: 'NU', assetType: 'cedear', operation: 'buy', quantity: 48, unitPrice: 7.33, date: '2026-04-07T12:00:00.000Z' },
  { id: 25, ticker: 'NU', assetType: 'cedear', operation: 'buy', quantity: 50, unitPrice: 7.45, date: '2026-04-07T12:00:00.000Z' },
  { id: 26, ticker: 'MELI', assetType: 'cedear', operation: 'buy', quantity: 12, unitPrice: 16.03, date: '2026-05-04T12:00:00.000Z' },
  { id: 27, ticker: 'MELI', assetType: 'cedear', operation: 'buy', quantity: 8, unitPrice: 15.63, date: '2026-05-04T12:00:00.000Z' },
  { id: 28, ticker: 'NU', assetType: 'cedear', operation: 'buy', quantity: 29, unitPrice: 7.22, date: '2026-05-04T12:00:00.000Z' },
]

// ── Helpers ──

function computePositions(transactions) {
  const map = {}
  for (const tx of transactions) {
    const key = tx.ticker
    if (!map[key]) {
      map[key] = { ticker: key, assetType: tx.assetType, quantity: 0, totalCost: 0, totalBought: 0 }
    }
    if (tx.operation === 'buy') {
      map[key].totalCost += tx.quantity * tx.unitPrice
      map[key].totalBought += tx.quantity
      map[key].quantity += tx.quantity
    } else {
      map[key].quantity -= tx.quantity
    }
  }
  return Object.values(map)
    .filter((p) => p.quantity > 0)
    .map((p) => ({
      ...p,
      avgPrice: p.totalBought > 0 ? p.totalCost / p.totalBought : 0,
    }))
}

function getPositionPrice(position, prices) {
  if (prices[position.ticker] != null) {
    return prices[position.ticker]
  }
  return position.avgPrice
}

function computeEvolutionData(transactions, positions, livePrices, historicalPrices) {
  const buys = [...transactions]
    .filter((t) => t.operation === 'buy')
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  if (buys.length === 0) return []

  const firstDate = new Date(buys[0].date)
  const now = new Date()

  const sampleSet = new Set()
  const d = new Date(firstDate)
  while (d <= now) {
    sampleSet.add(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 14)
  }
  buys.forEach((tx) => sampleSet.add(new Date(tx.date).toISOString().slice(0, 10)))
  sampleSet.add(now.toISOString().slice(0, 10))
  const dates = [...sampleSet].sort()

  const hasHistory = Object.keys(historicalPrices).length > 0

  const points = dates.map((dateStr) => {
    const dateMs = new Date(dateStr + 'T12:00:00Z').getTime()

    const holdings = {}
    let cumCost = 0
    for (const tx of buys) {
      if (new Date(tx.date).getTime() > dateMs + 12 * 3600000) break
      if (!holdings[tx.ticker]) holdings[tx.ticker] = { qty: 0, assetType: tx.assetType, cost: 0 }
      holdings[tx.ticker].qty += tx.quantity
      holdings[tx.ticker].cost += tx.quantity * tx.unitPrice
      cumCost += tx.quantity * tx.unitPrice
    }

    let valor = 0
    for (const [ticker, h] of Object.entries(holdings)) {
      if (h.assetType === 'crypto' && hasHistory) {
        const cgId = CRYPTO_MAP[ticker]
        if (cgId && historicalPrices[cgId]) {
          const price = findClosestPrice(historicalPrices[cgId], dateMs)
          if (price != null) {
            valor += h.qty * price
            continue
          }
        }
      }
      valor += h.cost
    }

    return {
      date: new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' }),
      rawDate: dateStr,
      invertido: Math.round(cumCost * 100) / 100,
      valor: hasHistory ? Math.round(valor * 100) / 100 : undefined,
    }
  })

  if (points.length > 0) {
    const last = points[points.length - 1]
    const currentValue = positions.reduce(
      (sum, p) => sum + getPositionPrice(p, livePrices) * p.quantity,
      0,
    )
    last.valor = Math.round(currentValue * 100) / 100
    last.date = 'Hoy'
  }

  return points
}

const HIST_CACHE_KEY = 'pt_historical_prices'
const HIST_CACHE_TTL = 24 * 60 * 60 * 1000

function getCachedHistorical() {
  try {
    const cached = JSON.parse(localStorage.getItem(HIST_CACHE_KEY))
    if (cached && Date.now() - cached.timestamp < HIST_CACHE_TTL) {
      return cached.data
    }
  } catch { /* ignore */ }
  return null
}

function setCachedHistorical(data) {
  localStorage.setItem(HIST_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }))
}

function findClosestPrice(priceArray, targetMs) {
  if (!priceArray || priceArray.length === 0) return null
  let lo = 0
  let hi = priceArray.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (priceArray[mid][0] < targetMs) lo = mid + 1
    else hi = mid
  }
  if (lo > 0) {
    const diffBefore = targetMs - priceArray[lo - 1][0]
    const diffAfter = priceArray[lo][0] - targetMs
    if (diffBefore < diffAfter) lo = lo - 1
  }
  return priceArray[lo][1]
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function formatRelativeTime(ts) {
  if (!ts) return '—'
  const diff = Math.max(0, Date.now() - ts)
  const sec = Math.round(diff / 1000)
  if (sec < 5) return 'ahora'
  if (sec < 60) return `hace ${sec}s`
  const min = Math.round(sec / 60)
  if (min < 60) return `hace ${min} min`
  const hr = Math.round(min / 60)
  return `hace ${hr}h`
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: USD {Number(entry.value).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  )
}

// ── App ──

function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pt_transactions') || '[]')
      return stored.length > 0 ? stored : INITIAL_TRANSACTIONS
    } catch {
      return INITIAL_TRANSACTIONS
    }
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [evoFilter, setEvoFilter] = useState('TODO')
  const [currency, setCurrency] = useState(() => localStorage.getItem('pt_currency') || 'USD')
  const [hideValues, setHideValues] = useState(() => localStorage.getItem('pt_hide_values') === '1')
  const [blueRate, setBlueRate] = useState(BLUE_FALLBACK)
  const [blueLoading, setBlueLoading] = useState(true)
  const [cclRate, setCclRate] = useState(CCL_FALLBACK)
  const [cclLoading, setCclLoading] = useState(true)
  const [cryptoPrices, setCryptoPrices] = useState({})
  const [crypto24h, setCrypto24h] = useState({})
  const [stockPrices, setStockPrices] = useState({})
  const [stock24h, setStock24h] = useState({})
  const [historicalPrices, setHistoricalPrices] = useState(() => getCachedHistorical() || {})
  const [cryptoOffline, setCryptoOffline] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [, setNowTick] = useState(0)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  // Form state
  const [ticker, setTicker] = useState('')
  const [assetType, setAssetType] = useState('crypto')
  const [operation, setOperation] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [priceCurrency, setPriceCurrency] = useState('USD')
  const [txDate, setTxDate] = useState(todayStr)

  useEffect(() => {
    localStorage.setItem('pt_transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('pt_hide_values', hideValues ? '1' : '0')
  }, [hideValues])

  useEffect(() => {
    localStorage.setItem('pt_currency', currency)
  }, [currency])

  // Tick every 30s so "hace Xs" stays fresh
  useEffect(() => {
    const t = setInterval(() => setNowTick((n) => n + 1), 30000)
    return () => clearInterval(t)
  }, [])

  // ── Dolar blue ──
  const fetchBlueRate = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/dolar`)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (data.venta) setBlueRate(data.venta)
    } catch {
      // keep fallback
    } finally {
      setBlueLoading(false)
    }
  }, [])

  // ── Dolar CCL ──
  const fetchCclRate = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/ccl`)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (data.venta) setCclRate(data.venta)
    } catch {
      // keep fallback
    } finally {
      setCclLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlueRate()
    fetchCclRate()
    const interval = setInterval(() => {
      fetchBlueRate()
      fetchCclRate()
    }, 60000)
    return () => clearInterval(interval)
  }, [fetchBlueRate, fetchCclRate])

  // ── Crypto prices ──
  const transactionsRef = useRef(transactions)
  transactionsRef.current = transactions

  const fetchCryptoPrices = useCallback(async () => {
    const currentTx = transactionsRef.current
    const ids = [
      ...new Set(
        currentTx
          .filter((t) => t.assetType === 'crypto')
          .map((t) => CRYPTO_MAP[t.ticker.toUpperCase()])
          .filter(Boolean),
      ),
    ]
    if (ids.length === 0) {
      setCryptoOffline(false)
      return
    }
    try {
      const res = await fetch(`${API_BASE}/crypto?ids=${ids.join(',')}`)
      if (!res.ok) throw new Error('CoinGecko error')
      const data = await res.json()
      const prices = {}
      const changes = {}
      for (const [symbol, cgId] of Object.entries(CRYPTO_MAP)) {
        if (data[cgId]?.usd != null) prices[symbol] = data[cgId].usd
        if (data[cgId]?.usd_24h_change != null) changes[symbol] = data[cgId].usd_24h_change
      }
      setCryptoPrices(prices)
      setCrypto24h(changes)
      setCryptoOffline(false)
      setLastUpdated(Date.now())
    } catch {
      setCryptoOffline(true)
    }
  }, [])

  // ── Stock prices ──
  const fetchStockPrices = useCallback(async () => {
    const currentTx = transactionsRef.current
    const tickers = [
      ...new Set(
        currentTx
          .filter((t) => t.assetType === 'cedear' || t.assetType === 'accion')
          .map((t) => t.ticker.toUpperCase()),
      ),
    ]
    if (tickers.length === 0) return

    const prices = {}
    const changes = {}
    await Promise.all(
      tickers.map(async (t) => {
        try {
          const res = await fetch(`${API_BASE}/stock?ticker=${t}`)
          if (!res.ok) return
          const data = await res.json()
          const meta = data?.chart?.result?.[0]?.meta
          const stockPrice = meta?.regularMarketPrice
          if (stockPrice != null) {
            const ratio = CEDEAR_RATIO[t] || 1
            prices[t] = stockPrice / ratio
          }
          // Yahoo gives absolute regularMarketPrice + previousClose. Compute % change.
          const prev = meta?.chartPreviousClose ?? meta?.previousClose
          if (stockPrice != null && prev != null && prev > 0) {
            changes[t] = ((stockPrice - prev) / prev) * 100
          }
        } catch {
          // skip
        }
      }),
    )
    if (Object.keys(prices).length > 0) {
      setStockPrices((prev) => ({ ...prev, ...prices }))
      setStock24h((prev) => ({ ...prev, ...changes }))
      setLastUpdated(Date.now())
    }
  }, [])

  useEffect(() => {
    fetchCryptoPrices()
    fetchStockPrices()
    const interval = setInterval(() => {
      fetchCryptoPrices()
      fetchStockPrices()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchCryptoPrices, fetchStockPrices])

  const prevCryptoTickers = useRef('')
  useEffect(() => {
    const tickers = [...new Set(transactions.filter((t) => t.assetType === 'crypto').map((t) => t.ticker))].sort().join(',')
    if (tickers !== prevCryptoTickers.current) {
      prevCryptoTickers.current = tickers
      fetchCryptoPrices()
    }
  }, [transactions, fetchCryptoPrices])

  const prevStockTickers = useRef('')
  useEffect(() => {
    const tickers = [...new Set(transactions.filter((t) => t.assetType === 'cedear' || t.assetType === 'accion').map((t) => t.ticker))].sort().join(',')
    if (tickers !== prevStockTickers.current) {
      prevStockTickers.current = tickers
      fetchStockPrices()
    }
  }, [transactions, fetchStockPrices])

  // ── Historical prices ──
  const [loadingHistorical, setLoadingHistorical] = useState(false)

  const fetchHistoricalPrices = useCallback(async () => {
    const cached = getCachedHistorical()
    if (cached && Object.keys(cached).length > 0) {
      setHistoricalPrices(cached)
      return
    }

    const currentTx = transactionsRef.current
    const ids = [
      ...new Set(
        currentTx
          .filter((t) => t.assetType === 'crypto')
          .map((t) => CRYPTO_MAP[t.ticker.toUpperCase()])
          .filter(Boolean),
      ),
    ]
    if (ids.length === 0) return

    setLoadingHistorical(true)
    const result = {}
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      try {
        if (i > 0) await new Promise((r) => setTimeout(r, 6000))
        let res = await fetch(`${API_BASE}/crypto/history?id=${id}&days=365`)
        if (res.status === 429) {
          await new Promise((r) => setTimeout(r, 30000))
          res = await fetch(`${API_BASE}/crypto/history?id=${id}&days=365`)
        }
        if (!res.ok) continue
        const data = await res.json()
        if (data.prices) {
          result[id] = data.prices
        }
      } catch {
        // skip
      }
    }

    if (Object.keys(result).length > 0) {
      setCachedHistorical(result)
      setHistoricalPrices(result)
    }
    setLoadingHistorical(false)
  }, [])

  useEffect(() => {
    const cached = getCachedHistorical()
    if (cached) setHistoricalPrices(cached)
  }, [])

  useEffect(() => {
    if (!ticker) return
    const existing = transactions.find((t) => t.ticker.toUpperCase() === ticker.toUpperCase())
    if (existing) setAssetType(existing.assetType)
  }, [ticker, transactions])

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  // ── Currency helpers ──
  // Per-asset-type rate: blue for crypto/general, CCL for cedear/accion
  const rateFor = (type) => (type === 'cedear' || type === 'accion' ? cclRate : blueRate)

  const get24h = (p) => {
    if (p.assetType === 'crypto') return crypto24h[p.ticker]
    if (p.assetType === 'cedear' || p.assetType === 'accion') return stock24h[p.ticker]
    return undefined
  }

  // Format a USD-denominated value, converting to ARS via the asset type's rate
  // when the currency toggle is set to ARS. For totals/aggregates, pass the
  // pre-computed `arsValue` (sum of per-position ARS) for accurate consolidated
  // conversion; otherwise the per-type rate is used.
  const fmt = (usdValue, type, arsValue) => {
    if (hideValues) return '••••••'
    if (currency === 'ARS') {
      const ars = arsValue != null ? arsValue : usdValue * rateFor(type)
      return 'ARS ' + Math.round(ars).toLocaleString('es-AR')
    }
    return 'USD ' + Number(usdValue).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  // Signed variant: "+USD 100.00" / "-ARS 12.345" (vs toLocaleString which emits "USD -100.00").
  const fmtSigned = (usdValue, type, arsValue) => {
    if (hideValues) return '••••••'
    const sign = usdValue >= 0 ? '+' : '-'
    if (currency === 'ARS') {
      const ars = arsValue != null ? arsValue : Math.abs(usdValue) * rateFor(type)
      return sign + 'ARS ' + Math.round(Math.abs(ars)).toLocaleString('es-AR')
    }
    return sign + 'USD ' + Math.abs(usdValue).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // ── Submit ──
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ticker || !quantity || !unitPrice) return
    const rawPrice = parseFloat(unitPrice)
    const formRate = rateFor(assetType)
    const usdPrice = priceCurrency === 'ARS' ? rawPrice / formRate : rawPrice
    const tx = {
      id: Date.now(),
      ticker: ticker.toUpperCase(),
      assetType,
      operation,
      quantity: parseFloat(quantity),
      unitPrice: usdPrice,
      date: new Date(txDate + 'T12:00:00').toISOString(),
    }
    setTransactions((prev) => [...prev, tx])
    setTicker('')
    setQuantity('')
    setUnitPrice('')
    setPriceCurrency('USD')
    setOperation('buy')
    setTxDate(todayStr)
    setActiveTab('dashboard')
    showToast('Transacción registrada')
  }

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const handleRefresh = () => {
    fetchBlueRate()
    fetchCclRate()
    fetchCryptoPrices()
    fetchStockPrices()
  }

  // ── Computed data ──
  const positions = computePositions(transactions)
  const livePrices = { ...stockPrices, ...cryptoPrices }

  const totalValue = positions.reduce((s, p) => s + getPositionPrice(p, livePrices) * p.quantity, 0)
  const totalCost = positions.reduce((s, p) => s + p.avgPrice * p.quantity, 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  // Per-asset-type consolidated ARS totals (blue for crypto, CCL for cedear/accion).
  const totalArs = positions.reduce(
    (s, p) => s + getPositionPrice(p, livePrices) * p.quantity * rateFor(p.assetType),
    0,
  )
  const totalCostArs = positions.reduce(
    (s, p) => s + p.avgPrice * p.quantity * rateFor(p.assetType),
    0,
  )
  const totalPnlArs = totalArs - totalCostArs

  // Weighted-average 24h portfolio change
  // Positions without 24h data contribute 0% to the sum (count their value in denominator).
  const portfolio24hPct = (() => {
    if (totalValue <= 0) return 0
    let weighted = 0
    for (const p of positions) {
      const ch = get24h(p)
      if (ch == null) continue
      const v = getPositionPrice(p, livePrices) * p.quantity
      weighted += (v / totalValue) * ch
    }
    return weighted
  })()

  const has24hData = positions.some((p) => get24h(p) != null)

  const donutData = positions
    .map((p) => ({
      name: p.ticker,
      value: Math.round(getPositionPrice(p, livePrices) * p.quantity * 100) / 100,
    }))
    .sort((a, b) => b.value - a.value)

  const ranked = positions
    .map((p) => {
      const price = getPositionPrice(p, livePrices)
      const pnlPct = p.avgPrice > 0 ? (price / p.avgPrice - 1) * 100 : 0
      return { ...p, currentPrice: price, pnlPct }
    })
    .sort((a, b) => b.pnlPct - a.pnlPct)

  const evolutionData = computeEvolutionData(transactions, positions, livePrices, historicalPrices)

  const filteredEvolutionData = (() => {
    if (evoFilter === 'TODO') return evolutionData
    const daysMap = { '1M': 30, '3M': 90, '6M': 180, '1A': 365 }
    const days = daysMap[evoFilter]
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    const cutoffStr = cutoff.toISOString().slice(0, 10)
    return evolutionData.filter((p) => p.rawDate >= cutoffStr)
  })()

  // Groups ordered crypto, cedear, accion, ...
  const assetTypeOrder = ['crypto', 'cedear', 'accion', 'bono', 'fci']
  const groups = assetTypeOrder
    .map((type) => {
      const gp = positions.filter((p) => p.assetType === type)
      if (gp.length === 0) return null
      const gValue = gp.reduce((s, p) => s + getPositionPrice(p, livePrices) * p.quantity, 0)
      const gCost = gp.reduce((s, p) => s + p.avgPrice * p.quantity, 0)
      return { type, label: TYPE_LABELS[type], positions: gp, value: gValue, cost: gCost }
    })
    .filter(Boolean)

  const cryptoCount = positions.filter((p) => p.assetType === 'crypto').length
  const stockCount = positions.filter((p) => p.assetType === 'cedear' || p.assetType === 'accion').length
  const bestMover = ranked[0]
  const worstMover = ranked.length > 1 ? ranked[ranked.length - 1] : null

  // ── Render helpers for hero ──
  const renderHeroValue = (value, prefix) => {
    if (hideValues) {
      return (
        <div className="hero-value">
          <span className="currency">{prefix}</span>
          <span>••••••</span>
        </div>
      )
    }
    const abs = Math.abs(value)
    const whole = Math.trunc(abs).toLocaleString('es-AR')
    const cents = abs.toFixed(2).split('.')[1] || '00'
    return (
      <div className="hero-value">
        <span className="currency">{prefix}</span>
        <span>{whole}</span>
        <span className="cents">,{cents}</span>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="shell">
        {/* ── Topbar ── */}
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">&#9670;</div>
            <div className="brand-name">Ledger</div>
            <div className="brand-sep">/</div>
            <div className="brand-sub serif">Personal portfolio</div>
          </div>
          <div className="nav">
            {['dashboard', 'register'].map((tab) => (
              <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                {{ dashboard: 'Dashboard', register: 'Registrar' }[tab]}
              </button>
            ))}
          </div>
          <div className="topbar-right">
            {cryptoOffline && (
              <span className="offline-badge" title="CoinGecko no responde. Reintentando cada 30s.">
                <span className="offline-dot" />
                Offline
              </span>
            )}
            <div className="chip" title="Blue (crypto / general) · CCL (CEDEARs)">
              <span className="dot" />
              Blue <strong>${blueLoading ? '...' : blueRate.toLocaleString('es-AR')}</strong>
              <span className="chip-sep">·</span>
              CCL <strong>${cclLoading ? '...' : cclRate.toLocaleString('es-AR')}</strong>
            </div>
            <button
              className="icon-btn"
              onClick={() => setHideValues((v) => !v)}
              title={hideValues ? 'Mostrar valores' : 'Ocultar valores'}
              aria-label={hideValues ? 'Mostrar valores' : 'Ocultar valores'}
            >
              {hideValues ? '🙈' : '👁'}
            </button>
            <div className="seg" role="group" aria-label="Moneda">
              <button className={currency === 'USD' ? 'active' : ''} onClick={() => setCurrency('USD')}>USD</button>
              <button className={currency === 'ARS' ? 'active' : ''} onClick={() => setCurrency('ARS')}>ARS</button>
            </div>
            <button className="icon-btn" onClick={handleRefresh} title="Actualizar precios">&#8635;</button>
          </div>
        </div>

        {/* ════ DASHBOARD ════ */}
        {activeTab === 'dashboard' && (
          <>
            {/* Summary bar: total + KPIs en una sola fila */}
            <div className="summary-bar">
              <div className="summary-totals">
                <div className="hero-label">
                  <span className="pill">Patrimonio neto</span>
                  <span className="hero-updated" title="Última actualización de precios">
                    {formatRelativeTime(lastUpdated)}
                  </span>
                </div>
                <div className="hero-values">
                  {currency === 'ARS'
                    ? renderHeroValue(totalArs, 'ARS')
                    : renderHeroValue(totalValue, 'USD')}
                  {has24hData ? (
                    <span className={`hero-24h ${portfolio24hPct >= 0 ? 'pos' : 'neg'}`} title="Variación 24h del portfolio">
                      {portfolio24hPct >= 0 ? '↑' : '↓'} {Math.abs(portfolio24hPct).toFixed(2)}%
                      <span className="hero-24h-tag">24h</span>
                    </span>
                  ) : (
                    <span className="hero-24h muted">— 24h</span>
                  )}
                </div>
              </div>
              <div className="summary-kpis">
                <div className="kpi">
                  <div className="kpi-label">Costo base</div>
                  <div className="kpi-value">{fmt(totalCost, undefined, totalCostArs)}</div>
                  <div className="kpi-sub">Capital invertido</div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">Ganancia</div>
                  <div className={`kpi-value ${totalPnl >= 0 ? 'pos' : 'neg'}`}>
                    {fmtSigned(totalPnl, undefined, totalPnlArs)}
                  </div>
                  <div className={`kpi-sub ${totalPnl >= 0 ? 'pos' : 'neg'}`}>
                    {totalPnl >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%
                  </div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">Mejor</div>
                  <div className="kpi-value">{bestMover?.ticker || '—'}</div>
                  <div className={`kpi-sub ${bestMover && bestMover.pnlPct >= 0 ? 'pos' : 'neg'}`}>
                    {bestMover ? `${bestMover.pnlPct >= 0 ? '+' : ''}${bestMover.pnlPct.toFixed(2)}%` : ''}
                  </div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">Peor</div>
                  <div className="kpi-value">{worstMover?.ticker || '—'}</div>
                  <div className={`kpi-sub ${worstMover && worstMover.pnlPct >= 0 ? 'pos' : 'neg'}`}>
                    {worstMover ? `${worstMover.pnlPct >= 0 ? '+' : ''}${worstMover.pnlPct.toFixed(2)}%` : ''}
                  </div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">Posiciones</div>
                  <div className="kpi-value">{positions.length}</div>
                  <div className="kpi-sub">
                    {cryptoCount} crypto · {stockCount} cedears
                  </div>
                </div>
              </div>
            </div>

            {/* Middle row: chart compacto + donut */}
            <div className="grid grid-mid">
              <div className="panel panel-evolution">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Evolución <span className="serif">· valor vs costo</span></div>
                    <div className="panel-sub">Valor de mercado versus capital invertido</div>
                  </div>
                  <div className="panel-head-right">
                    <div className="range-selector">
                      {['1M', '3M', '6M', '1A', 'TODO'].map((f) => (
                        <button key={f} className={evoFilter === f ? 'active' : ''} onClick={() => setEvoFilter(f)}>{f}</button>
                      ))}
                    </div>
                    {Object.keys(historicalPrices).length === 0 && (
                      <button className="load-hist-btn" onClick={fetchHistoricalPrices} disabled={loadingHistorical}>
                        {loadingHistorical ? 'Cargando...' : 'Cargar históricos'}
                      </button>
                    )}
                  </div>
                </div>
                {filteredEvolutionData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={filteredEvolutionData} margin={{ top: 8, right: 10, left: 4, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradValor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke={LINE} vertical={false} />
                      <XAxis dataKey="date" stroke={MUTE} fontSize={10} tickLine={false} axisLine={{ stroke: LINE }} />
                      <YAxis stroke={MUTE} fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} width={44} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="invertido" name="Invertido" stroke={MUTE} fill="none" strokeWidth={1.4} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="valor" name="Valor" stroke={ACCENT} fill="url(#gradValor)" strokeWidth={2} connectNulls={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="empty">Registrá transacciones para ver la evolución.</p>
                )}
              </div>

              <div className="panel panel-donut">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Distribución <span className="serif">· por activo</span></div>
                    <div className="panel-sub">Peso sobre el total</div>
                  </div>
                </div>
                {donutData.length > 0 ? (
                  <div className="donut-wrap">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={78}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          labelLine={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            if (percent < 0.07) return null
                            const RADIAN = Math.PI / 180
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                            const x = cx + radius * Math.cos(-midAngle * RADIAN)
                            const y = cy + radius * Math.sin(-midAngle * RADIAN)
                            return (
                              <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
                                {(percent * 100).toFixed(0)}%
                              </text>
                            )
                          }}
                        >
                          {donutData.map((entry) => (
                            <Cell key={entry.name} fill={ASSET_COLORS[entry.name] || '#52525B'} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => `USD ${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
                          contentStyle={{ background: '#111114', border: '1px solid #2A2A31', borderRadius: 10, color: '#F4F4F5', fontSize: 12, fontFamily: 'Geist Mono, monospace' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-legend">
                      {donutData.map((entry) => {
                        const pct = totalValue > 0 ? (entry.value / totalValue) * 100 : 0
                        return (
                          <div key={entry.name} className="donut-legend-item">
                            <span className="alloc-swatch" style={{ background: ASSET_COLORS[entry.name] || '#52525B' }} />
                            <span className="alloc-ticker">{entry.name}</span>
                            <span className="alloc-pct">{pct.toFixed(1)}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="empty">Sin datos</p>
                )}
              </div>
            </div>

            {/* Tabla de posiciones agrupada */}
            <div className="positions-section">
              {positions.length === 0 ? (
                <p className="empty">No hay posiciones. Registrá una transacción para comenzar.</p>
              ) : (
                <>
                  {groups.map((g) => {
                    const gPnl = g.value - g.cost
                    const gPnlPct = g.cost > 0 ? (gPnl / g.cost) * 100 : 0
                    const gWeight = totalValue > 0 ? (g.value / totalValue) * 100 : 0

                    return (
                      <div key={g.type} className="portfolio-group">
                        <div className="group-title" style={{ borderLeftColor: TYPE_BORDER[g.type] }}>
                          <span className="group-title-label">{g.label}</span>
                          <span className="group-title-meta">
                            {g.positions.length} {g.positions.length === 1 ? 'posición' : 'posiciones'} · {gWeight.toFixed(1)}% del portfolio
                          </span>
                        </div>
                        <div className="ptable-wrap">
                          <table className="ptable">
                            <colgroup>
                              <col style={{ width: '14%' }} />
                              <col style={{ width: '11%' }} />
                              <col style={{ width: '10%' }} />
                              <col style={{ width: '12%' }} />
                              <col style={{ width: '12%' }} />
                              <col style={{ width: '13%' }} />
                              <col style={{ width: '11%' }} />
                              <col style={{ width: '13%' }} />
                              <col style={{ width: '40px' }} />
                            </colgroup>
                            <thead>
                              <tr>
                                <th className="col-text">Activo</th>
                                <th className="col-num">Cantidad</th>
                                <th className="col-num">Var 24h</th>
                                <th className="col-num">Último precio</th>
                                <th className="col-num">Precio prom.</th>
                                <th className="col-num">Ganancia</th>
                                <th className="col-num">Rendim.</th>
                                <th className="col-num">Monto total</th>
                                <th className="col-act"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {g.positions.map((p) => {
                                const price = getPositionPrice(p, livePrices)
                                const hasRealPrice = livePrices[p.ticker] != null
                                const value = price * p.quantity
                                const cost = p.avgPrice * p.quantity
                                const pnl = value - cost
                                const pnlPct = p.avgPrice > 0 ? (price / p.avgPrice - 1) * 100 : 0
                                const change24h = get24h(p)

                                return (
                                  <tr key={p.ticker}>
                                    <td className="cell-ticker">
                                      <span className="ticker-name" style={{ color: ASSET_COLORS[p.ticker] || '#fff' }}>{p.ticker}</span>
                                    </td>
                                    <td className="col-num">{p.quantity.toLocaleString('es-AR', { maximumFractionDigits: 8 })}</td>
                                    <td className="col-num">
                                      {change24h != null ? (
                                        <span className={`pnl-pct ${change24h >= 0 ? 'pos' : 'neg'}`}>
                                          {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                                        </span>
                                      ) : (
                                        <span className="dim">—</span>
                                      )}
                                    </td>
                                    <td className="col-num">
                                      {fmt(price, p.assetType)}
                                      {!hasRealPrice && <span className="estimated-icon" title="Precio promedio de compra"> ~</span>}
                                    </td>
                                    <td className="col-num dim">{fmt(p.avgPrice, p.assetType)}</td>
                                    <td className={`col-num ${pnl >= 0 ? 'positive' : 'negative'}`}>
                                      {fmtSigned(pnl, p.assetType)}
                                    </td>
                                    <td className="col-num">
                                      <span className={`pnl-pct ${pnlPct >= 0 ? 'pos' : 'neg'}`}>
                                        {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                                      </span>
                                    </td>
                                    <td className="col-num">{fmt(value, p.assetType)}</td>
                                    <td className="col-act">
                                      <button
                                        className="row-delete"
                                        onClick={() => transactions.filter((t) => t.ticker === p.ticker).forEach((t) => handleDelete(t.id))}
                                        title="Eliminar"
                                      >&times;</button>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                            <tfoot>
                              <tr className="subtotal-row">
                                <td className="subtotal-label" colSpan={5}>Subtotal · {g.label}</td>
                                <td className={`col-num ${gPnl >= 0 ? 'positive' : 'negative'}`}>
                                  {fmtSigned(gPnl, g.type)}
                                </td>
                                <td className="col-num">
                                  <span className={`pnl-pct ${gPnlPct >= 0 ? 'pos' : 'neg'}`}>
                                    {gPnlPct >= 0 ? '+' : ''}{gPnlPct.toFixed(2)}%
                                  </span>
                                </td>
                                <td className="col-num">{fmt(g.value, g.type)}</td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )
                  })}
                  <div className="portfolio-grand-total">
                    <div className="grand-total-label">
                      <span className="grand-eyebrow">Total del portfolio</span>
                      <span className="grand-meta">
                        {positions.length} posiciones · costo {fmt(totalCost, undefined, totalCostArs)}
                      </span>
                    </div>
                    <div className="grand-total-numbers">
                      <span className="grand-total-value">{fmt(totalValue, undefined, totalArs)}</span>
                      <span className={`grand-total-pnl ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
                        {fmtSigned(totalPnl, undefined, totalPnlArs)}
                      </span>
                      <span className={`pnl-pct grand-total-pct ${totalPnl >= 0 ? 'pos' : 'neg'}`}>
                        {totalPnl >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ════ REGISTRO ════ */}
        {activeTab === 'register' && (
          <>
            <div className="page-head">
              <div>
                <div className="page-eyebrow">Nueva operación</div>
                <h1 className="page-title">Registrar transacción</h1>
              </div>
            </div>
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ticker">Ticker</label>
                  <input id="ticker" type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="BTC, ETH, META..." required />
                </div>
                <div className="form-group">
                  <label htmlFor="assetType">Tipo de activo</label>
                  <select id="assetType" value={assetType} onChange={(e) => setAssetType(e.target.value)}>
                    <option value="crypto">Crypto</option>
                    <option value="cedear">CEDEAR</option>
                    <option value="accion">Acción</option>
                    <option value="bono">Bono</option>
                    <option value="fci">FCI</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Operación</label>
                <div className="operation-toggle">
                  <button type="button" className={operation === 'buy' ? 'active buy' : ''} onClick={() => setOperation('buy')}>Compra</button>
                  <button type="button" className={operation === 'sell' ? 'active sell' : ''} onClick={() => setOperation('sell')}>Venta</button>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Cantidad</label>
                  <input id="quantity" type="number" step="any" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0.00" required />
                </div>
                <div className="form-group">
                  <div className="price-label-row">
                    <label htmlFor="unitPrice">Precio unitario</label>
                    <div className="price-currency-toggle">
                      <button type="button" className={priceCurrency === 'USD' ? 'active' : ''} onClick={() => setPriceCurrency('USD')}>USD</button>
                      <button type="button" className={priceCurrency === 'ARS' ? 'active' : ''} onClick={() => setPriceCurrency('ARS')}>ARS</button>
                    </div>
                  </div>
                  <input id="unitPrice" type="number" step="any" min="0" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00" required />
                  {priceCurrency === 'ARS' && unitPrice && parseFloat(unitPrice) > 0 && rateFor(assetType) > 0 && (() => {
                    const isCedearLike = assetType === 'cedear' || assetType === 'accion'
                    const rate = rateFor(assetType)
                    const rateLabel = isCedearLike ? 'CCL' : 'Blue'
                    return (
                      <div className="price-conversion-hint">
                        ARS ${parseFloat(unitPrice).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {` ÷ ${rateLabel} $`}{rate.toLocaleString('es-AR')}
                        {' = USD $'}{(parseFloat(unitPrice) / rate).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    )
                  })()}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="txDate">Fecha</label>
                <input id="txDate" type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} required />
              </div>
              <button type="submit" className="submit-btn">Registrar transacción →</button>
            </form>
          </>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
