// src/components/ScamAlertCard.jsx
import '../styles/cards.css' // hoặc walletscoring.css, tuỳ bạn đang dùng

export default function ScamAlertCard({ blacklist, detectionMode }) {
  if (!blacklist) return null

  const source = blacklist.source || (
    detectionMode && detectionMode.startsWith('blacklist')
      ? detectionMode.replace('blacklist_', '')
      : 'unknown'
  )

  let title = 'High-risk address detected'
  let subtitle = ''
  if (source === 'local') {
    subtitle =
      'This address appears in the unified phishing blacklist collected from multiple datasets.'
  } else if (source === 'etherscan') {
    subtitle =
      'This address is tagged as phishing / scam on Etherscan.'
  } else {
    subtitle =
      'This address is flagged as highly risky by blacklist sources.'
  }

  const sources = blacklist.local_info?.sources || ''

  return (
    <section className="card card-scam-alert">
      <div className="card-scam-alert-header">
        <div className="alert-badge">ALERT</div>
        <h3>{title}</h3>
      </div>

      <p className="card-scam-alert-subtitle">{subtitle}</p>

      <div className="card-scam-alert-body">
        <div className="alert-row">
          <span>Detection source</span>
          <strong>
            {source === 'local'
              ? 'Local blacklist'
              : source === 'etherscan'
              ? 'Etherscan tag'
              : 'Blacklist'}
          </strong>
        </div>

        <div className="alert-row">
          <span>Risk</span>
          <strong>Scam risk 100%</strong>
        </div>
      </div>
    </section>
  )
}
