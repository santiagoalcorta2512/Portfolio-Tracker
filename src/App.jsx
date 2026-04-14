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
const API_BASE = 'http://localhost:3001/api'

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
  RON: '#1A73E8',
  META: '#0668E1',
  MSFT: '#00BCF2',
  NU: '#820AD1',
}

const TYPE_BORDER = {
  crypto: '#F7931A',
  cedear: '#00A3E0',
  accion: '#8b5cf6',
  bono: '#06b6d4',
  fci: '#ec4899',
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

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-brand">
          <span className="logo-icon">&#9650;</span>
          <span className="logo-text">PORTFOLIO</span>
        </div>
        <div className="header-portfolio">
          <span className="header-total">{formatPrice(totalValue)}</span>
          <span className={`header-pnl ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
            {totalPnl >= 0 ? '+' : ''}{formatPrice(totalPnl)} ({totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%)
          </span>
        </div>
        <div className="header-controls">
          {cryptoOffline && (
            <span className="offline-badge" title="CoinGecko no responde. Reintentando cada 30s.">
              <span className="offline-dot" />
              Precios offline
            </span>
          )}
          <span className="blue-rate" title="Dolar blue (venta)">
            Blue: ${blueLoading ? '...' : blueRate.toLocaleString('es-AR')}
          </span>
          <div className="currency-toggle">
            <button className={currency === 'USD' ? 'active' : ''} onClick={() => setCurrency('USD')}>USD</button>
            <button className={currency === 'ARS' ? 'active' : ''} onClick={() => setCurrency('ARS')}>ARS</button>
          </div>
          <button className="refresh-btn" onClick={handleRefresh} title="Actualizar precios">&#8635;</button>
        </div>
      </header>

      {/* ── Tabs ── */}
      <nav className="tabs">
        {['dashboard', 'portfolio', 'register', 'charts'].map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {{ dashboard: 'Dashboard', portfolio: 'Portfolio', register: 'Registrar', charts: 'Graficos' }[tab]}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main className={`content ${activeTab !== 'register' ? 'wide' : ''}`}>

        {/* ════ DASHBOARD ════ */}
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stat-cards">
              <div className="stat-card">
                <span className="stat-label">Valor total</span>
                <span className="stat-value">{formatPrice(totalValue)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Costo total</span>
                <span className="stat-value">{formatPrice(totalCost)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">P&amp;L</span>
                <span className={`stat-value ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
                  {totalPnl >= 0 ? '+' : ''}{formatPrice(totalPnl)}
                  <span className="stat-pct"> ({totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%)</span>
                </span>
              </div>
            </div>

            {/* Evolution chart - prominent */}
            <div className="dashboard-section chart-hero">
              <div className="section-header">
                <h3 className="section-title">Evolucion del portfolio</h3>
                {Object.keys(historicalPrices).length === 0 && (
                  <button className="load-hist-btn" onClick={fetchHistoricalPrices} disabled={loadingHistorical}>
                    {loadingHistorical ? 'Cargando...' : 'Cargar historicos'}
                  </button>
                )}
              </div>
              {evolutionData.length > 1 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradInvertido" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F7931A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradValor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#66BB6A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="date" stroke="#444" fontSize={11} />
                    <YAxis stroke="#444" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="invertido" name="Invertido" stroke="#F7931A" fill="url(#gradInvertido)" strokeWidth={2} strokeDasharray="6 3" />
                    <Area type="monotone" dataKey="valor" name="Valor actual" stroke="#66BB6A" fill="url(#gradValor)" strokeWidth={2} connectNulls={false} />
                    <Legend formatter={(value) => <span style={{ color: '#999', fontSize: 12 }}>{value}</span>} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="empty">Registra transacciones para ver la evolucion.</p>
              )}
            </div>

            {/* Donut + Ranking */}
            <div className="dashboard-grid">
              <div className="dashboard-section">
                <h3 className="section-title">Distribucion por activo</h3>
                {donutData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" nameKey="name">
                        {donutData.map((entry) => (
                          <Cell key={entry.name} fill={ASSET_COLORS[entry.name] || '#555'} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `USD ${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
                        contentStyle={{ background: '#141414', border: '1px solid #222', borderRadius: 8, color: '#e0e0e0', fontSize: 12 }}
                      />
                      <Legend formatter={(value) => <span style={{ color: '#999', fontSize: 12 }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="empty">Sin datos</p>
                )}
              </div>

              <div className="dashboard-section">
                <h3 className="section-title">Top movers</h3>
                {ranked.length > 0 ? (
                  <div className="ranking-list">
                    {ranked.map((p, i) => (
                      <div key={p.ticker} className="ranking-item">
                        <span className="ranking-pos">#{i + 1}</span>
                        <span className="ranking-ticker" style={{ color: ASSET_COLORS[p.ticker] || '#fff' }}>{p.ticker}</span>
                        <span className={`ranking-badge type-${p.assetType}`}>{TYPE_LABELS[p.assetType]}</span>
                        <span className={`ranking-pnl ${p.pnlPct >= 0 ? 'positive' : 'negative'}`}>
                          {p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty">Sin posiciones</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════ PORTFOLIO ════ */}
        {activeTab === 'portfolio' && (
          <div className="portfolio">
            {positions.length === 0 ? (
              <p className="empty">No hay posiciones. Registra una transaccion para comenzar.</p>
            ) : (
              <>
                {groups.map((g) => {
                  const gPnl = g.value - g.cost
                  const gPnlPct = g.cost > 0 ? (gPnl / g.cost) * 100 : 0
                  const gWeight = totalValue > 0 ? (g.value / totalValue) * 100 : 0

                  return (
                    <div key={g.type} className="portfolio-group">
                      <h3 className="group-title" style={{ borderLeftColor: TYPE_BORDER[g.type] }}>{g.label}</h3>
                      <div className="ptable-wrap">
                        <table className="ptable">
                          <thead>
                            <tr>
                              <th className="col-ticker">Activo</th>
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
                                <tr key={p.ticker} style={{ borderLeftColor: TYPE_BORDER[g.type] }}>
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
                                  <td className={`col-num ${pnlPct >= 0 ? 'positive' : 'negative'}`}>
                                    {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                                  </td>
                                  <td className="col-num">{weight.toFixed(1)}%</td>
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
                              <td>Subtotal</td>
                              <td></td>
                              <td></td>
                              <td className="col-num">{formatPrice(g.value)}</td>
                              <td className="col-num dim">{formatPrice(g.cost)}</td>
                              <td className={`col-num ${gPnl >= 0 ? 'positive' : 'negative'}`}>
                                {gPnl >= 0 ? '+' : ''}{formatPrice(gPnl)}
                              </td>
                              <td className={`col-num ${gPnlPct >= 0 ? 'positive' : 'negative'}`}>
                                {gPnlPct >= 0 ? '+' : ''}{gPnlPct.toFixed(2)}%
                              </td>
                              <td className="col-num">{gWeight.toFixed(1)}%</td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )
                })}
                <div className="portfolio-grand-total">
                  <span>TOTAL</span>
                  <span className="grand-total-value">{formatPrice(totalValue)}</span>
                  <span className={`grand-total-pnl ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
                    {totalPnl >= 0 ? '+' : ''}{formatPrice(totalPnl)} ({totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%)
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* ════ REGISTRO ════ */}
        {activeTab === 'register' && (
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
                  <option value="accion">Accion</option>
                  <option value="bono">Bono</option>
                  <option value="fci">FCI</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Operacion</label>
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
            <button type="submit" className="submit-btn">Registrar transaccion</button>
          </form>
        )}

        {/* ════ GRAFICOS ════ */}
        {activeTab === 'charts' && (
          <div className="charts-tab">
            <div className="chart-section">
              <div className="section-header">
                <h3 className="section-title">Evolucion del portfolio</h3>
                {Object.keys(historicalPrices).length === 0 && (
                  <button className="load-hist-btn" onClick={fetchHistoricalPrices} disabled={loadingHistorical}>
                    {loadingHistorical ? 'Cargando...' : 'Cargar historicos'}
                  </button>
                )}
              </div>
              {evolutionData.length > 1 ? (
                <ResponsiveContainer width="100%" height={380}>
                  <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradInv2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F7931A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradVal2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#66BB6A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="date" stroke="#444" fontSize={11} />
                    <YAxis stroke="#444" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="invertido" name="Invertido" stroke="#F7931A" fill="url(#gradInv2)" strokeWidth={2} strokeDasharray="6 3" />
                    <Area type="monotone" dataKey="valor" name="Valor actual" stroke="#66BB6A" fill="url(#gradVal2)" strokeWidth={2} connectNulls={false} />
                    <Legend formatter={(value) => <span style={{ color: '#999', fontSize: 12 }}>{value}</span>} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="empty">Registra transacciones para ver la evolucion.</p>
              )}
            </div>

            <div className="chart-section">
              <h3 className="section-title">Valor vs Costo por activo</h3>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={Math.max(260, barData.length * 52)}>
                  <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 80, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                    <YAxis type="category" dataKey="ticker" stroke="#888" fontSize={12} width={50} />
                    <XAxis type="number" stroke="#444" fontSize={11} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend formatter={(value) => <span style={{ color: '#999', fontSize: 12 }}>{value}</span>} />
                    <Bar dataKey="Costo" fill="#333" radius={[0, 4, 4, 0]} barSize={16} />
                    <Bar dataKey="Valor" fill="#00A3E0" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="empty">Sin datos para graficar.</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
