// src/pages/WalletScoringPage.jsx
import { useState } from 'react'
import SearchSection from '../components/SearchSection'
import HealthOverview from '../components/HealthOverview'
import ScamAlertCard from '../components/ScamAlertCard'
import '../styles/walletscoring.css'

export default function WalletScoringPage({
  walletData,
  loading,
  defaultWalletAddress,
  onSearchWallet,
}) {
  const [activeTab, setActiveTab] = useState('health')

  const toxicScore = walletData?.toxicScore
  const riskLevel = walletData?.riskLevel

  const showAlert =
    walletData?.blacklist?.is_scam === true ||
    (walletData?.detectionMode &&
      walletData.detectionMode.startsWith('blacklist'))

  return (
    <div className="wallet-scoring-page">
      {/* Wrapper riêng cho search để dễ chỉnh khoảng cách */}
      <div className="wallet-search-row">
        <SearchSection
          onSearch={onSearchWallet}
          loading={loading}
          defaultWalletAddress={defaultWalletAddress}
          variant="flat" 
        />
      </div>

      <div
        className={`content-wrapper ${
          showAlert ? '' : 'content-wrapper--single'
        }`}
      >
        <div className="left-column">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
              onClick={() => setActiveTab('health')}
            >
              Wallet health
            </button>
            <button
              className={`tab-btn ${activeTab === 'toxic' ? 'active' : ''}`}
              onClick={() => setActiveTab('toxic')}
            >
              Toxic score
            </button>
          </div>

          {activeTab === 'health' ? (
            <HealthOverview data={walletData} />
          ) : (
            <section className="card card-health-overview">
              <div className="health-overview-content">
                <h3>Toxic score</h3>

                {!walletData || toxicScore == null ? (
                  <>
                    <p className="no-data-text">No data</p>
                    <p className="helper-text">
                      Input wallet address to start search
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ marginBottom: '1.5rem' }}>
                      This wallet has a toxic score of{' '}
                      <strong>
                        {typeof toxicScore === 'number'
                          ? (toxicScore * 100).toFixed(1) + '%'
                          : toxicScore}
                      </strong>{' '}
                      – risk level: <strong>{riskLevel || 'Unknown'}</strong>.
                    </p>
                    <h4>Assessment summary</h4>
                    <p className="helper-text">
                      Toxic score is derived from the ScamRadar AI model and
                      reflects how likely this wallet is involved in risky
                      activities.
                    </p>
                  </>
                )}
              </div>
            </section>
          )}
        </div>

        {showAlert && (
          <div className="right-column">
            <ScamAlertCard
              blacklist={walletData?.blacklist}
              detectionMode={walletData?.detectionMode}
            />
          </div>
        )}
      </div>
    </div>
  )
}
