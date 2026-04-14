# Portfolio Tracker — Rediseño V2
## Documento de diseño

### Filosofía
Dark theme premium, estilo fintech. Inspirado en Delta (crypto), CoinStats (dashboard), y Kubera (multi-asset).
Tipografía monospace (JetBrains Mono). Colores: fondo #0c0c0c, acentos naranja #F7931A (crypto), azul #00A3E0 (cedear), verde #66BB6A (ganancia), rojo #EF5350 (pérdida).

---

### HEADER (siempre visible)
- Logo "PORTFOLIO" con ícono ◉ naranja
- Valor total del portfolio GRANDE (28px+) a la izquierda
- P&L total en verde/rojo al lado del valor total
- Badge dólar blue en tiempo real
- Toggle USD / ARS
- Botón refresh ↻
- Timestamp "Actualizado HH:MM"

---

### TAB 1: DASHBOARD
Protagonista: gráfico de evolución grande (50% del viewport)

**Fila superior — 3 stat cards:**
- Valor total (con moneda activa)
- Costo total invertido
- P&L total (monto + porcentaje, color verde/rojo)

**Gráfico principal — Evolución del portfolio:**
- AreaChart grande, prominente
- Línea de valor actual + área con gradiente
- Línea punteada de costo acumulado
- Tooltips con fecha y valor
- Selector de rango: 1M / 3M / 6M / 1A / TODO

**Fila inferior — dos paneles lado a lado:**

Panel izquierdo — Distribución:
- Donut chart POR ACTIVO INDIVIDUAL (no por tipo)
- Cada activo con su color y porcentaje
- BTC naranja, ETH azul-violeta, BNB amarillo, etc.
- Porcentajes visibles en la leyenda

Panel derecho — Top movers:
- Ranking de rendimiento P&L %
- Mejores arriba en verde, peores abajo en rojo
- Badge con el tipo (CRYPTO / CEDEAR)
- Mini sparkline de 7 días si es posible

---

### TAB 2: PORTFOLIO
Vista tipo tabla compacta (estilo Kubera), NO cards grandes.

**Header de tabla:**
Activo | Tipo | Cantidad | Precio actual | Valor | Costo | P&L ($) | P&L (%) | % Portfolio

**Filas:**
- Borde izquierdo de color por tipo (naranja=crypto, azul=cedear)
- Ticker en bold, tipo en badge pequeño
- Precio clickeable para editar manualmente
- P&L con color verde/rojo
- Indicador ~ amarillo si precio es estimado
- Hover effect sutil en cada fila

**Agrupación:**
- Subtítulo separador por tipo de activo: "CRYPTO" / "CEDEARs"
- Subtotal por grupo (valor, costo, P&L del grupo)
- Al final: TOTAL general

**Funcionalidades:**
- Ordenar por: P&L%, Valor, Nombre, % Portfolio
- Filtrar por tipo
- Columna de % del portfolio (peso de cada activo sobre el total)

---

### TAB 3: REGISTRAR
Formulario centrado, limpio.

**Campos:**
- Ticker (con autocomplete de tickers existentes)
- Tipo de activo (Crypto / CEDEAR / Acción USA / Bono) — autodetectar si ticker existe
- Operación: Compra / Venta (botones toggle)
- Cantidad
- Precio unitario (USD)
- Fecha (date picker, default hoy)
- Botón "Registrar transacción" prominente

**Post-registro:**
- Toast "Transacción registrada ✓" por 3 segundos
- Redirect automático al tab Portfolio

**Historial de transacciones debajo:**
- Lista compacta de todas las transacciones
- Columnas: Fecha | C/V | Ticker | Cantidad | Precio | Total
- Botón eliminar (×) por transacción
- Ordenado por fecha desc (más reciente primero)

---

### TAB 4: GRÁFICOS

**Gráfico 1 — Evolución del portfolio (duplicado del dashboard pero más grande):**
- AreaChart full width
- Selector de rango temporal
- Tooltip detallado

**Gráfico 2 — Valor vs Costo por activo:**
- BarChart horizontal (más legible que vertical)
- Barra gris = costo, barra de color = valor actual
- Ordenado por valor desc
- P&L al costado de cada barra

**Gráfico 3 — Distribución por tipo:**
- Donut chart: Crypto vs CEDEARs (vs Bonos vs Acciones USA cuando se agreguen)
- Con montos y porcentajes

**Gráfico 4 — Timeline de inversiones:**
- Scatter/timeline mostrando cada compra como un punto
- Eje X = fecha, Eje Y = monto invertido
- Color por tipo de activo
- Muestra el historial de DCA visual

---

### MEJORAS UX GENERALES
- Animaciones sutiles en transiciones de tab (fade)
- Números que se actualizan con transición suave
- Responsive: que se vea bien en pantalla completa y en ventana chica
- Export CSV de transacciones
- Import CSV para carga masiva
- Tooltip en el ~ de precio estimado: "Precio promedio de compra — sin cotización en tiempo real"

---

### COLORES POR ACTIVO (para el donut chart)
- BTC: #F7931A (naranja bitcoin)
- ETH: #627EEA (azul ethereum)
- BNB: #F3BA2F (amarillo binance)  
- RON: #1A73E8 (azul ronin)
- META: #0668E1 (azul meta)
- MSFT: #00BCF2 (azul microsoft)
- NU: #820AD1 (violeta nubank)
