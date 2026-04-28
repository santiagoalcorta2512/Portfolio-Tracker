import { useState, useEffect, useCallback, useRef } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import './App.css'

// ── Constants ──

const BLUE_FALLBACK = 1200
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

  // Sample dates: every 14 days + each transaction date + today
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

    // Replay transactions up to this date
    const holdings = {} // ticker -> { qty, assetType, cost }
    let cumCost = 0
    for (const tx of buys) {
      if (new Date(tx.date).getTime() > dateMs + 12 * 3600000) break
      if (!holdings[tx.ticker]) holdings[tx.ticker] = { qty: 0, assetType: tx.assetType, cost: 0 }
      holdings[tx.ticker].qty += tx.quantity
      holdings[tx.ticker].cost += tx.quantity * tx.unitPrice
      cumCost += tx.quantity * tx.unitPrice
    }

    // Compute portfolio value at this date
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
      // Non-crypto or no history: use cost as value
      valor += h.cost
    }

    return {
      date: new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' }),
      rawDate: dateStr,
      invertido: Math.round(cumCost * 100) / 100,
      valor: hasHistory ? Math.round(valor * 100) / 100 : undefined,
    }
  })

  // Last point: use live prices for accuracy
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

// ── Historical price cache (localStorage, 24h TTL) ──

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

// Binary-search the closest price in a [[timestamp, price], ...] array
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

// ── Custom tooltip ──

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
  const [currency, setCurrency] = useState('USD')
  const [blueRate, setBlueRate] = useState(BLUE_FALLBACK)
  const [blueLoading, setBlueLoading] = useState(true)
  const [cryptoPrices, setCryptoPrices] = useState({})
  const [stockPrices, setStockPrices] = useState({})
  const [historicalPrices, setHistoricalPrices] = useState(() => getCachedHistorical() || {})
  const [cryptoOffline, setCryptoOffline] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  // Form state
  const [ticker, setTicker] = useState('')
  const [assetType, setAssetType] = useState('crypto')
  const [operation, setOperation] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [txDate, setTxDate] = useState(todayStr)

  // Persist transactions
  useEffect(() => {
    localStorage.setItem('pt_transactions', JSON.stringify(transactions))
  }, [transactions])

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

  useEffect(() => {
    fetchBlueRate()
    const interval = setInterval(fetchBlueRate, 60000)
    return () => clearInterval(interval)
  }, [fetchBlueRate])

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
      for (const [symbol, cgId] of Object.entries(CRYPTO_MAP)) {
        if (data[cgId]?.usd != null) prices[symbol] = data[cgId].usd
      }
      setCryptoPrices(prices)
      setCryptoOffline(false)
    } catch {
      setCryptoOffline(true)
    }
  }, [])

  // ── Stock prices (Yahoo Finance for CEDEARs) ──
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
    await Promise.all(
      tickers.map(async (t) => {
        try {
          const res = await fetch(`${API_BASE}/stock?ticker=${t}`)
          if (!res.ok) return
          const data = await res.json()
          const stockPrice = data?.chart?.result?.[0]?.meta?.regularMarketPrice
          if (stockPrice != null) {
            const ratio = CEDEAR_RATIO[t] || 1
            prices[t] = stockPrice / ratio
          }
        } catch {
          // keep fallback
        }
      }),
    )
    if (Object.keys(prices).length > 0) {
      setStockPrices((prev) => ({ ...prev, ...prices }))
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

  // ── Historical prices (CoinGecko market_chart) ──
  const [loadingHistorical, setLoadingHistorical] = useState(false)

  const fetchHistoricalPrices = useCallback(async () => {
    // Skip if cache is still valid
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
        // Retry once on 429 after 30s
        if (res.status === 429) {
          await new Promise((r) => setTimeout(r, 30000))
          res = await fetch(`${API_BASE}/crypto/history?id=${id}&days=365`)
        }
        if (!res.ok) continue
        const data = await res.json()
        if (data.prices) {
          result[id] = data.prices // [[timestamp, price], ...]
        }
      } catch {
        // skip this coin, continue with the rest
      }
    }

    if (Object.keys(result).length > 0) {
      setCachedHistorical(result)
      setHistoricalPrices(result)
    }
    setLoadingHistorical(false)
  }, [])

  // Load from cache on mount (no API call)
  useEffect(() => {
    const cached = getCachedHistorical()
    if (cached) setHistoricalPrices(cached)
  }, [])

  // ── Auto-fill asset type ──
  useEffect(() => {
    if (!ticker) return
    const existing = transactions.find((t) => t.ticker.toUpperCase() === ticker.toUpperCase())
    if (existing) setAssetType(existing.assetType)
  }, [ticker, transactions])

  // ── Toast ──
  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  // ── Currency ──
  const convert = (usdValue) => (currency === 'ARS' ? usdValue * blueRate : usdValue)
  const formatPrice = (value) => {
    const prefix = currency === 'ARS' ? 'ARS ' : 'USD '
    return prefix + convert(value).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // ── Submit ──
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ticker || !quantity || !unitPrice) return
    const tx = {
      id: Date.now(),
      ticker: ticker.toUpperCase(),
      assetType,
      operation,
      quantity: parseFloat(quantity),
      unitPrice: parseFloat(unitPrice),
      date: new Date(txDate + 'T12:00:00').toISOString(),
    }
    setTransactions((prev) => [...prev, tx])
    setTicker('')
    setQuantity('')
    setUnitPrice('')
    setOperation('buy')
    setTxDate(todayStr)
    setActiveTab('portfolio')
    showToast('Transaccion registrada')
  }

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const handleRefresh = () => {
    fetchBlueRate()
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

  // Donut: per individual asset
  const donutData = positions
    .map((p) => ({
      name: p.ticker,
      value: Math.round(getPositionPrice(p, livePrices) * p.quantity * 100) / 100,
    }))
    .sort((a, b) => b.value - a.value)

  // Ranking by P&L %
  const ranked = positions
    .map((p) => {
      const price = getPositionPrice(p, livePrices)
      const pnlPct = p.avgPrice > 0 ? (price / p.avgPrice - 1) * 100 : 0
      return { ...p, currentPrice: price, pnlPct }
    })
    .sort((a, b) => b.pnlPct - a.pnlPct)

  // Evolution data for AreaChart
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

  // Bar data: horizontal, sorted by value desc, with P&L
  const barData = positions
    .map((p) => {
      const valor = getPositionPrice(p, livePrices) * p.quantity
      const costo = p.avgPrice * p.quantity
      const pnl = valor - costo
      return {
        ticker: p.ticker,
        Costo: Math.round(costo * 100) / 100,
        Valor: Math.round(valor * 100) / 100,
        pnl: Math.round(pnl * 100) / 100,
      }
    })
    .sort((a, b) => b.Valor - a.Valor)

  // Portfolio table groups
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

  // ── Render ──

  // Hero display: split value into whole/cents parts
  const heroValueRaw = Math.abs(convert(totalValue))
  const heroWhole = Math.trunc(heroValueRaw).toLocaleString('es-AR')
  const heroCents = heroValueRaw.toFixed(2).split('.')[1] || '00'

  const topAsset = donutData[0]
  const topAssetPct = topAsset && totalValue > 0 ? (topAsset.value / totalValue) * 100 : 0
  const cryptoCount = positions.filter((p) => p.assetType === 'crypto').length
  const stockCount = positions.filter((p) => p.assetType === 'cedear' || p.assetType === 'accion').length
  const bestMover = ranked[0]

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
            {['dashboard', 'portfolio', 'register', 'charts'].map((tab) => (
              <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                {{ dashboard: 'Dashboard', portfolio: 'Portfolio', register: 'Registrar', charts: 'Gráficos' }[tab]}
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
            <div className="chip" title="Dólar blue (venta)">
              <span className="dot" />
              Blue <strong>${blueLoading ? '...' : blueRate.toLocaleString('es-AR')}</strong>
            </div>
            <div className="seg">
              <button className={currency === 'USD' ? 'active' : ''} onClick={() => setCurrency('USD')}>USD</button>
              <button className={currency === 'ARS' ? 'active' : ''} onClick={() => setCurrency('ARS')}>ARS</button>
            </div>
            <button className="icon-btn" onClick={handleRefresh} title="Actualizar precios">&#8635;</button>
          </div>
        </div>

        {/* ════ DASHBOARD ════ */}
        {activeTab === 'dashboard' && (
          <>
            {/* Hero */}
            <div className="hero">
              <div>
                <div className="hero-label">
                  <span className="pill">Patrimonio neto</span>
                  {!cryptoOffline && <span>· precios en vivo</span>}
                </div>
                <div className="hero-value">
                  <span className="currency">{currency}</span>
                  <span>{heroWhole}</span>
                  <span className="cents">,{heroCents}</span>
                </div>
                <div className="hero-delta">
                  <span className={`amt ${totalPnl >= 0 ? 'pos' : 'neg'}`}>
                    {totalPnl >= 0 ? '+' : ''}
                    {convert(totalPnl).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`pct ${totalPnl >= 0 ? 'pos' : 'neg'}`}>
                    {totalPnl >= 0 ? '↑' : '↓'} {Math.abs(totalPnlPct).toFixed(2)}%
                  </span>
                  <span className="period">· desde el inicio</span>
                </div>
              </div>
              <div className="hero-right">
                <div className="hero-tagline">
                  {positions.length} posiciones entre <em>crypto</em> y CEDEARs argentinos.
                  {topAsset && <> Top activo: <em>{topAsset.name}</em> con {topAssetPct.toFixed(1)}% del portfolio.</>}
                </div>
                {filteredEvolutionData.length > 1 && (
                  <div className="hero-spark">
                    <ResponsiveContainer width="100%" height={72}>
                      <AreaChart data={filteredEvolutionData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.28} />
                            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="valor"
                          stroke={ACCENT}
                          strokeWidth={1.5}
                          fill="url(#heroSpark)"
                          dot={false}
                          connectNulls
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* KPIs */}
            <div className="kpis">
              <div className="kpi">
                <div className="kpi-label">Costo base</div>
                <div className="kpi-value">{formatPrice(totalCost)}</div>
                <div className="kpi-sub">Capital invertido</div>
              </div>
              <div className="kpi">
                <div className="kpi-label">Ganancia no realizada</div>
                <div className={`kpi-value ${totalPnl >= 0 ? 'pos' : 'neg'}`}>
                  {totalPnl >= 0 ? '+' : ''}{formatPrice(totalPnl)}
                </div>
                <div className={`kpi-sub ${totalPnl >= 0 ? 'pos' : 'neg'}`}>
                  {totalPnl >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}% total return
                </div>
              </div>
              <div className="kpi">
                <div className="kpi-label">Mejor activo</div>
                <div className="kpi-value">{bestMover?.ticker || '—'}</div>
                <div className={`kpi-sub ${bestMover && bestMover.pnlPct >= 0 ? 'pos' : 'neg'}`}>
                  {bestMover ? `${bestMover.pnlPct >= 0 ? '+' : ''}${bestMover.pnlPct.toFixed(2)}%` : ''}
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

            {/* Evolution chart */}
            <div className="grid grid-chart">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Evolución <span className="serif">· valor vs costo</span></div>
                    <div className="panel-sub">Valor de mercado versus capital invertido</div>
                  </div>
                  <div className="panel-head-right">
                    <div className="chart-legend">
                      <div className="legend-item"><span className="legend-swatch" style={{ background: ACCENT }} />Valor</div>
                      <div className="legend-item"><span className="legend-swatch" style={{ background: MUTE }} />Invertido</div>
                    </div>
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
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={filteredEvolutionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradValor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke={LINE} vertical={false} />
                      <XAxis dataKey="date" stroke={MUTE} fontSize={11} tickLine={false} axisLine={{ stroke: LINE }} />
                      <YAxis stroke={MUTE} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="invertido" name="Invertido" stroke={MUTE} fill="none" strokeWidth={1.4} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="valor" name="Valor" stroke={ACCENT} fill="url(#gradValor)" strokeWidth={2} connectNulls={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="empty">Registrá transacciones para ver la evolución.</p>
                )}
              </div>
            </div>

            {/* Three-column panels: donut, allocation list, movers */}
            <div className="grid grid-three">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Distribución <span className="serif">· donut</span></div>
                    <div className="panel-sub">Peso sobre el total</div>
                  </div>
                </div>
                {donutData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={82}
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
                            <span className="alloc-pct" style={{ marginLeft: 'auto' }}>{pct.toFixed(1)}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="empty">Sin datos</p>
                )}
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Allocation <span className="serif">· lista</span></div>
                    <div className="panel-sub">Valor actual por activo</div>
                  </div>
                </div>
                {donutData.length > 0 ? (
                  <>
                    <div className="alloc-bar">
                      {donutData.map((entry) => (
                        <div key={entry.name} style={{ background: ASSET_COLORS[entry.name] || '#52525B', flex: entry.value / totalValue }} />
                      ))}
                    </div>
                    <div className="alloc-list">
                      {donutData.map((entry) => {
                        const pct = totalValue > 0 ? (entry.value / totalValue) * 100 : 0
                        return (
                          <div key={entry.name} className="alloc-row">
                            <span className="alloc-swatch" style={{ background: ASSET_COLORS[entry.name] || '#52525B' }} />
                            <span className="alloc-ticker">{entry.name}</span>
                            <span className="alloc-pct">{pct.toFixed(1)}%</span>
                            <span className="alloc-val">${entry.value.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="empty">Sin posiciones</p>
                )}
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Top movers <span className="serif">· retorno total</span></div>
                    <div className="panel-sub">Desde la compra</div>
                  </div>
                </div>
                {ranked.length > 0 ? (
                  <div className="ranking-list">
                    {ranked.map((p) => {
                      const posValue = p.currentPrice * p.quantity
                      const weight = totalValue > 0 ? (posValue / totalValue) * 100 : 0
                      return (
                        <div key={p.ticker} className="ranking-item">
                          <div className="mover-logo" style={{ background: ASSET_COLORS[p.ticker] || '#2A2A31' }}>
                            {p.ticker.slice(0, 3)}
                          </div>
                          <div className="mover-body">
                            <div className="mover-header">
                              <span className="mover-ticker">{p.ticker}</span>
                              <span className={`ranking-badge type-${p.assetType}`}>{TYPE_LABELS[p.assetType]}</span>
                            </div>
                            <div className="mover-sub">{formatPrice(posValue)} · {weight.toFixed(1)}%</div>
                          </div>
                          <div className="mover-side">
                            <span className={`mover-pct ${p.pnlPct >= 0 ? 'pos' : 'neg'}`}>
                              {p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="empty">Sin posiciones</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* ════ PORTFOLIO ════ */}
        {activeTab === 'portfolio' && (
          <>
            <div className="page-head">
              <div>
                <div className="page-eyebrow">Posiciones</div>
                <h1 className="page-title">Portfolio detallado</h1>
              </div>
            </div>
            <div className="portfolio">
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
                          {g.positions.length} {g.positions.length === 1 ? 'posición' : 'posiciones'}
                        </span>
                      </div>
                      <div className="ptable-wrap">
                        <table className="ptable">
                          <colgroup>
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '11%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '11%' }} />
                            <col style={{ width: '14%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '44px' }} />
                          </colgroup>
                          <thead>
                            <tr>
                              <th className="col-text">Activo</th>
                              <th className="col-num">Cantidad</th>
                              <th className="col-num">Precio</th>
                              <th className="col-num">Valor</th>
                              <th className="col-num">Costo</th>
                              <th className="col-num">P&amp;L</th>
                              <th className="col-num">P&amp;L %</th>
                              <th className="col-num">% Port.</th>
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
                              const weight = totalValue > 0 ? (value / totalValue) * 100 : 0

                              return (
                                <tr key={p.ticker}>
                                  <td className="cell-ticker">
                                    <span className="ticker-name" style={{ color: ASSET_COLORS[p.ticker] || '#fff' }}>{p.ticker}</span>
                                  </td>
                                  <td className="col-num">{p.quantity.toLocaleString('es-AR', { maximumFractionDigits: 8 })}</td>
                                  <td className="col-num">
                                    {formatPrice(price)}
                                    {!hasRealPrice && <span className="estimated-icon" title="Precio promedio de compra"> ~</span>}
                                  </td>
                                  <td className="col-num">{formatPrice(value)}</td>
                                  <td className="col-num dim">{formatPrice(cost)}</td>
                                  <td className={`col-num ${pnl >= 0 ? 'positive' : 'negative'}`}>
                                    {pnl >= 0 ? '+' : ''}{formatPrice(pnl)}
                                  </td>
                                  <td className="col-num">
                                    <span className={`pnl-pct ${pnlPct >= 0 ? 'pos' : 'neg'}`}>
                                      {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                                    </span>
                                  </td>
                                  <td className="col-num dim">{weight.toFixed(1)}%</td>
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
                              <td className="subtotal-label" colSpan={3}>Subtotal · {g.label}</td>
                              <td className="col-num">{formatPrice(g.value)}</td>
                              <td className="col-num dim">{formatPrice(g.cost)}</td>
                              <td className={`col-num ${gPnl >= 0 ? 'positive' : 'negative'}`}>
                                {gPnl >= 0 ? '+' : ''}{formatPrice(gPnl)}
                              </td>
                              <td className="col-num">
                                <span className={`pnl-pct ${gPnlPct >= 0 ? 'pos' : 'neg'}`}>
                                  {gPnlPct >= 0 ? '+' : ''}{gPnlPct.toFixed(2)}%
                                </span>
                              </td>
                              <td className="col-num dim">{gWeight.toFixed(1)}%</td>
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
                      {positions.length} posiciones · costo {formatPrice(totalCost)}
                    </span>
                  </div>
                  <div className="grand-total-numbers">
                    <span className="grand-total-value">{formatPrice(totalValue)}</span>
                    <span className={`grand-total-pnl ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
                      {totalPnl >= 0 ? '+' : ''}{formatPrice(totalPnl)}
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
                  <label htmlFor="unitPrice">Precio unitario (USD)</label>
                  <input id="unitPrice" type="number" step="any" min="0" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00" required />
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

        {/* ════ GRAFICOS ════ */}
        {activeTab === 'charts' && (
          <>
            <div className="page-head">
              <div>
                <div className="page-eyebrow">Analítica</div>
                <h1 className="page-title">Gráficos</h1>
              </div>
            </div>
            <div className="charts-tab">
              <div className="chart-section">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">Evolución del portfolio</h3>
                    <div className="panel-sub">Valor total y costo invertido a lo largo del tiempo</div>
                  </div>
                  <div className="section-header-right">
                    <div className="chart-legend">
                      <div className="legend-item"><span className="legend-swatch" style={{ background: ACCENT }} />Valor</div>
                      <div className="legend-item"><span className="legend-swatch" style={{ background: MUTE }} />Invertido</div>
                    </div>
                    <div className="evo-filters">
                      {['1M', '3M', '6M', '1A', 'TODO'].map((f) => (
                        <button key={f} className={`evo-filter-btn${evoFilter === f ? ' active' : ''}`} onClick={() => setEvoFilter(f)}>{f}</button>
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
                  <ResponsiveContainer width="100%" height={380}>
                    <AreaChart data={filteredEvolutionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradVal2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke={LINE} vertical={false} />
                      <XAxis dataKey="date" stroke={MUTE} fontSize={11} tickLine={false} axisLine={{ stroke: LINE }} />
                      <YAxis stroke={MUTE} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="invertido" name="Invertido" stroke={MUTE} fill="none" strokeWidth={1.4} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="valor" name="Valor" stroke={ACCENT} fill="url(#gradVal2)" strokeWidth={2} connectNulls={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="empty">Registrá transacciones para ver la evolución.</p>
                )}
              </div>

              <div className="chart-section">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">Valor vs costo <span className="serif">· por activo</span></h3>
                    <div className="panel-sub">Comparación de capital invertido y valor de mercado</div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item"><span className="legend-swatch" style={{ background: '#2A2A31', height: 8 }} />Costo</div>
                    <div className="legend-item"><span className="legend-swatch" style={{ background: ACCENT, height: 8 }} />Valor</div>
                  </div>
                </div>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={Math.max(260, barData.length * 56)}>
                    <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 80, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 4" stroke={LINE} horizontal={false} />
                      <YAxis type="category" dataKey="ticker" stroke={MUTE} fontSize={12} width={60} tickLine={false} axisLine={false} />
                      <XAxis type="number" stroke={MUTE} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="Costo" fill="#2A2A31" radius={[0, 5, 5, 0]} barSize={18} />
                      <Bar dataKey="Valor" fill={ACCENT} radius={[0, 5, 5, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="empty">Sin datos para graficar.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
