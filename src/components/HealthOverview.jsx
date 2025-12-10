// src/components/HealthOverview.jsx
import '../styles/cards.css'

export default function HealthOverview({ data }) {
  const hasData = data && typeof data.score === 'number'

  return (
    <section className="card card-health-overview">
      <div className="health-overview-content">
        <h3>Health overview</h3>

        {!hasData ? (
          <>
            <p className="no-data-text">No data</p>
            <p className="helper-text">Input wallet address to start search</p>
            <h4>Wallet security assessment</h4>
            <div className="assessment-score">
              <span className="score-number">0</span>
              <span className="score-label">out of 100</span>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="rgba(255,255,255,0.1)"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(data.score / 100) * 502.4} 502.4`}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '90px 90px',
                    transition: 'stroke-dasharray 0.6s ease',
                  }}
                />
                <text
                  x="90"
                  y="85"
                  textAnchor="middle"
                  fontSize="36"
                  fontWeight="800"
                  fill="white"
                >
                  {data.score}
                </text>
                <text
                  x="90"
                  y="105"
                  textAnchor="middle"
                  fontSize="14"
                  fill="rgba(255,255,255,0.7)"
                >
                  out of 100
                </text>
              </svg>
            </div>

            <h4>Assessment Details</h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <span>Toxic Score:</span>
                <strong>{data.toxicScore}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <span>Risk Level:</span>
                <strong>{data.riskLevel}</strong>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
