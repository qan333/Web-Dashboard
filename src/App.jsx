import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SearchSection from './components/SearchSection'
import HealthOverview from './components/HealthOverview'
import PortfolioSummary from './components/PortfolioSummary'
import ValueAtRisk from './components/ValueAtRisk'
import FlaggedAssets from './components/FlaggedAssets'
import ApprovalsWidget from './components/ApprovalsWidget'
import AlertNotification from './components/AlertNotification'
import './styles/global.css'

function App() {
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const isValidEthAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 3000)
  }

  const searchWallet = async (address, network) => {
    if (!address) {
      showAlert('Please enter a wallet address', 'warning')
      return
    }

    if (!isValidEthAddress(address)) {
      showAlert('Invalid Ethereum address format', 'danger')
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const data = {
        address,
        network,
        score: Math.floor(Math.random() * 100),
        toxicScore: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        portfolioValue: Math.random() * 100000,
        tokens: Math.floor(Math.random() * 20),
        nfts: Math.floor(Math.random() * 10),
        valueAtRisk: Math.random() * 10000,
        riskyTokens: Math.floor(Math.random() * 5),
        honeypot: Math.floor(Math.random() * 3),
        washTraded: Math.floor(Math.random() * 2),
        highRiskTx: Math.floor(Math.random() * 10),
        mediumRiskTx: Math.floor(Math.random() * 20),
        totalTx: Math.floor(Math.random() * 200),
        highRiskApprovals: Math.floor(Math.random() * 5),
        mediumRiskApprovals: Math.floor(Math.random() * 10),
        lowRiskApprovals: Math.floor(Math.random() * 15),
        priceChange: (Math.random() - 0.5) * 50 > 0 ? `+${(Math.random() * 50).toFixed(1)}%` : `${(Math.random() * -50).toFixed(1)}%`,
        fairPrice: `$${(Math.random() * 5000).toFixed(2)}`
      }

      setWalletData(data)
      setLoading(false)
      showAlert('Wallet analysis complete!', 'success')
    }, 1500)
  }

  const toggleFavorite = (address) => {
    if (favorites.includes(address)) {
      setFavorites(favorites.filter(fav => fav !== address))
    } else {
      setFavorites([...favorites, address])
      localStorage.setItem('favorites', JSON.stringify([...favorites, address]))
      showAlert('Added to favorites!', 'success')
    }
  }

  return (
    <div className="container">
      <Sidebar />
      <main className="main-content">
        <Header onFavorite={() => walletData && toggleFavorite(walletData.address)} />
        <SearchSection onSearch={searchWallet} loading={loading} />

        <div className="content-wrapper">
          {/* Left Column */}
          <div className="left-column">
            <div className="tabs">
              <button className="tab-btn active">Wallet health</button>
              <button className="tab-btn">Toxic score</button>
            </div>
            <HealthOverview data={walletData} />
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="cards-row">
              <PortfolioSummary data={walletData} />
              <ValueAtRisk data={walletData} />
            </div>

            <div className="cards-row">
              <FlaggedAssets data={walletData} />
              <ApprovalsWidget data={walletData} />
            </div>
          </div>
        </div>
      </main>

      {alert && <AlertNotification message={alert.message} type={alert.type} />}
    </div>
  )
}

export default App
