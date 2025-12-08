// src/App.jsx
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import AlertNotification from './components/AlertNotification'
import { detectAccount } from './services/api'
import WalletScoringPage from './pages/WalletScoringPage'
import ApprovalAuditPage from './pages/ApprovalAuditPage'
import TransactionMonitorPage from './pages/TransactionMonitorPage'
import AlertTrackerPage from './pages/AlertTrackerPage'
import './styles/global.css'

function App() {
  const [activePage, setActivePage] = useState('wallet')

  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [connectedWallet, setConnectedWallet] = useState(null)

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const isValidEthAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address)

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 3000)
  }

  // ===== CONNECT WALLET =====
  const connectWallet = async () => {
    if (typeof window === 'undefined') {
      showAlert('Window object is not available', 'danger')
      return
    }

    const eth = window.ethereum
    if (!eth) {
      showAlert('No Web3 wallet detected. Please install MetaMask.', 'warning')
      return
    }

    let provider = eth
    if (eth.providers && eth.providers.length) {
      provider = eth.providers.find((p) => p.isMetaMask) || eth.providers[0]
    }

    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      const addr = accounts?.[0]
      if (addr) {
        setConnectedWallet(addr)
        showAlert(
          `Connected wallet ${addr.slice(0, 6)}...${addr.slice(-4)}`,
          'success'
        )
      } else {
        showAlert('No account returned from wallet.', 'warning')
      }
    } catch (err) {
      console.error(err)
      if (err.code === 4001) {
        showAlert('Connection request was rejected.', 'info')
      } else {
        showAlert('Failed to connect wallet.', 'danger')
      }
    }
  }

  useEffect(() => {
    const eth = window.ethereum
    if (!eth || !eth.on) return

    const handler = (accounts) => {
      const addr = accounts?.[0] || null
      setConnectedWallet(addr)
      if (addr) showAlert('Account changed in wallet.', 'info')
    }

    eth.on('accountsChanged', handler)
    return () => {
      eth.removeListener?.('accountsChanged', handler)
    }
  }, [])

  // ===== SEARCH / CALL BACKEND =====
  const searchWallet = async (address, network) => {
    const trimmed = (address || '').trim()

    if (!trimmed) {
      showAlert('Please enter a wallet address', 'warning')
      return
    }

    if (!isValidEthAddress(trimmed)) {
      showAlert('Invalid Ethereum address format', 'danger')
      return
    }

    if (network !== 'ethereum') {
      showAlert('Currently only Ethereum mainnet is supported.', 'warning')
      return
    }

    setLoading(true)

    try {
      const res = await detectAccount(trimmed)

      const scamProb =
        res.account_scam_probability ??
        res.scam_probability ??
        0

      const score = Math.round((1 - scamProb) * 100)

      let riskLevel = 'Medium'
      if (scamProb < 0.3) riskLevel = 'Low'
      else if (scamProb >= 0.7) riskLevel = 'High'

      const data = {
        address: trimmed,
        network,
        score,
        toxicScore: scamProb.toFixed(2),
        riskLevel,
        portfolioValue: res.portfolio_value ?? 0,
        tokens: res.risky_tokens_count ?? 0,
        nfts: res.risky_nfts_count ?? 0,
        valueAtRisk: res.value_at_risk ?? 0,
        riskyTokens: res.risky_tokens_count ?? 0,
        honeypot: res.honeypot_tokens_count ?? 0,
        washTraded: res.wash_traded_tokens_count ?? 0,
        highRiskTx: res.high_risk_transactions ?? 0,
        mediumRiskTx: res.medium_risk_transactions ?? 0,
        totalTx: res.total_transactions ?? 0,
        highRiskApprovals: res.high_risk_approvals ?? 0,
        mediumRiskApprovals: res.medium_risk_approvals ?? 0,
        lowRiskApprovals: res.low_risk_approvals ?? 0,
        priceChange: res.price_change ?? null,
        fairPrice: res.fair_price ?? null,
        raw: res,
      }

      setWalletData(data)
      showAlert('Wallet analysis complete!', 'success')
    } catch (err) {
      console.error(err)
      showAlert(err.message || 'Failed to analyze wallet', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (address) => {
    if (!address) return

    setFavorites((prev) => {
      let next
      if (prev.includes(address)) {
        next = prev.filter((fav) => fav !== address)
        showAlert('Removed from favorites', 'info')
      } else {
        next = [...prev, address]
        showAlert('Added to favorites!', 'success')
      }
      try {
        localStorage.setItem('favorites', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  // ===== ROUTING GIỮA CÁC PAGE =====
  const renderPage = () => {
    switch (activePage) {
      case 'wallet':
        return (
          <WalletScoringPage
            walletData={walletData}
            loading={loading}
            defaultWalletAddress={connectedWallet}
            onSearchWallet={searchWallet}
          />
        )
      case 'approval':
        return <ApprovalAuditPage />
      case 'tx-monitor':
        return <TransactionMonitorPage />
      case 'alerts':
        return <AlertTrackerPage />
      default:
        return null
    }
  }

  return (
    <div className="container">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />

      <main className="main-content">
        <Header
          onFavorite={() => walletData && toggleFavorite(walletData.address)}
          onConnectWallet={connectWallet}
          walletAddress={connectedWallet}
        />

        {renderPage()}
      </main>

      {alert && (
        <AlertNotification message={alert.message} type={alert.type} />
      )}
    </div>
  )
}

export default App
