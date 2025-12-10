// SearchSection.jsx
import { useEffect, useState } from 'react'
import '../styles/search.css'

export default function SearchSection({
  onSearch,
  loading,
  defaultWalletAddress,
  variant = 'card',        // 'card' | 'flat'
}) {
  const [walletAddress, setWalletAddress] = useState('')
  const [network, setNetwork] = useState('ethereum')

  useEffect(() => {
    if (defaultWalletAddress) {
      setWalletAddress(defaultWalletAddress)
    }
  }, [defaultWalletAddress])

  const handleSearch = () => {
    onSearch(walletAddress, network)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const rootClass =
    'search-section ' +
    (variant === 'flat' ? 'search-section--flat' : 'search-section--card')

  return (
    <section className={rootClass}>
      <div className="search-box-container">
        <div className="search-input-group">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M14 14L19 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            className="wallet-input"
            placeholder="Search by ETH address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {/* Nếu sau này muốn bật lại network:
          <select
            className="network-select"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            <option value="ethereum">Ethereum network</option>
            <option value="bsc">BSC Network</option>
            <option value="polygon">Polygon Network</option>
          </select>
          */}
        </div>

        <button
          className="btn-search"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <span className="spinner"></span> : 'Search'}
        </button>
      </div>
    </section>
  )
}
