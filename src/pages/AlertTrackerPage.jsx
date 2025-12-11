// src/pages/AlertTrackerPage.jsx
import { useState } from 'react'
import SearchSection from '../components/SearchSection'
import { detectAccountBlacklist } from '../services/api'
import '../styles/tx-alert.css'
import '../styles/walletscoring.css'

const STORAGE_KEY = 'scamradar-alert-tracker-v2'

export default function AlertTrackerPage({ reports = [] }) {
  // Khởi tạo từ localStorage, fallback sang props reports, cuối cùng là []
  const [rows, setRows] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) return parsed
        }
      }
    } catch (e) {
      console.warn('Failed to load alert tracker from localStorage:', e)
    }

    // Fallback: map dữ liệu cũ từ props (logic cũ)
    if (Array.isArray(reports) && reports.length > 0) {
      const mapped = reports.map((r) => {
        const addr = (r.address || '').toLowerCase()
        return {
          id: r.id ?? `${addr}-${r.createdAt}`,
          address: addr,
          status: 'Imported from local report',
          source: 'Imported',
          url: addr ? `https://etherscan.io/address/${addr}` : null,
        }
      })
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped))
        }
      } catch (e) {
        console.warn('Failed to persist imported reports:', e)
      }
      return mapped
    }

    return []
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // state cho modal
  const [modal, setModal] = useState({
    open: false,
    type: 'clean', // 'clean' | 'scam' | 'error'
    address: '',
    status: '',
    source: '',
  })

  const persistRows = (updater) => {
    setRows((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        }
      } catch (e) {
        console.warn('Failed to save alert tracker to localStorage:', e)
      }
      return next
    })
  }

  const handleSearch = async (address) => {
    const addr = address.trim()
    if (!addr) return

    setLoading(true)
    setError(null)

    try {
      const res = await detectAccountBlacklist(addr)

      const isScam =
        res?.blacklist?.is_scam === true ||
        (typeof res?.account_scam_probability === 'number' &&
          res.account_scam_probability >= 0.99) ||
        (res?.risk_level && res.risk_level.toLowerCase() === 'high')

      const status = isScam
        ? 'Blacklisted / Scam'
        : 'Clean'

      const normalizedAddress = (res.account_address || addr).toLowerCase()

      let source = 'No blacklist / tag'
      if (isScam) {
        if (res.blacklist?.source === 'local') source = 'Local blacklist'
        else if (res.blacklist?.source === 'etherscan') source = 'Public Source'
        else source = 'Blacklist / scam tag'
      } else if (res.blacklist?.etherscan_exists === false) {
        source = 'Not found'
      }

      const newRow = {
        id: Date.now(),
        address: normalizedAddress,
        status,
        source,
        url: `https://etherscan.io/address/${normalizedAddress}`,
      }

      // cập nhật bảng, giữ duy nhất 1 dòng cho mỗi address
      persistRows((prev) => {
        const filtered = prev.filter(
          (r) => (r.address || '').toLowerCase() !== normalizedAddress
        )
        return [newRow, ...filtered]
      })

      // mở modal
      setModal({
        open: true,
        type: isScam ? 'scam' : 'clean',
        address: normalizedAddress,
        status,
        source,
      })
    } catch (err) {
      console.error('detect-bl error:', err)

      const msg = err?.message || ''
      let status = 'Error'
      let source = 'Error'

      if (msg.includes('404') || /Address not found/i.test(msg)) {
        status = 'Not found on Etherscan/blacklist'
        source = 'Not found'
      }

      const normalizedAddress = addr.toLowerCase()

      const newRow = {
        id: Date.now(),
        address: normalizedAddress,
        status,
        source,
        url: `https://etherscan.io/address/${normalizedAddress}`,
      }

      persistRows((prev) => {
        const filtered = prev.filter(
          (r) => (r.address || '').toLowerCase() !== normalizedAddress
        )
        return [newRow, ...filtered]
      })

      setError(msg)

      // modal kiểu error / not-found
      setModal({
        open: true,
        type: 'error',
        address: normalizedAddress,
        status,
        source,
      })
    } finally {
      setLoading(false)
    }
  }

  const hasReports = rows.length > 0

  const handleClearHistory = () => {
    persistRows([])
  }

  const closeModal = () =>
    setModal((m) => ({
      ...m,
      open: false,
    }))

  return (
    <div className="wallet-scoring-page alert-tracker-page">
      <div className="wallet-search-row">
        <SearchSection
          onSearch={handleSearch}
          loading={loading}
          defaultWalletAddress=""
          variant="flat"
        />
      </div>

      <div className="content-wrapper content-wrapper--single">
        <div className="left-column">
          <section className="card card-alert-tracker">
            <div className="card-header">
              <div>
                <h3>Report manager</h3>
                <p className="muted-1">
                  Reports are saved locally in your browser (localStorage). Use
                  them for your thesis / analysis.
                </p>
              </div>

              {hasReports && (
                <button className="action-btn" onClick={handleClearHistory}>
                  Clear history
                </button>
              )}
            </div>

            <div className="card-body">
              {error && <p className="error-text">{error}</p>}

              {!hasReports && !loading && (
                <p>No reports yet. Enter a wallet address to start.</p>
              )}

              {hasReports && (
                <div className="report-table-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Source</th>
                        <th className="view-col">View on Etherscan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.id}>
                          <td className="accent">{r.address}</td>

                          <td
                            className={
                              r.status === 'Blacklisted / Scam'
                                ? 'status-cell status-cell--danger'
                                : 'status-cell'
                            }
                          >
                            {r.status}
                          </td>

                          <td>{r.source || '-------'}</td>

                          <td className="view-col">
                            {r.url ? (
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="etherscan-link-btn"
                              >
                                View
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ===== Modal alert Clean / Scam ===== */}
      {modal.open && (
        <div className="alert-modal-backdrop" onClick={closeModal}>
          <div
            className={`alert-modal ${
              modal.type === 'scam'
                ? 'alert-modal--danger'
                : modal.type === 'clean'
                ? 'alert-modal--clean'
                : 'alert-modal--neutral'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="alert-modal-title">
              {modal.type === 'scam'
                ? 'High-risk wallet detected'
                : modal.type === 'clean'
                ? 'Wallet appears clean'
                : 'Lookup result'}
            </h4>

            <p className="alert-modal-address">
              Address:{' '}
              <span className="accent monospace">{modal.address}</span>
            </p>
            <p className="alert-modal-status">
              Status: <strong>{modal.status}</strong>
            </p>
            {modal.source && (
              <p className="alert-modal-source">
                Source: <span>{modal.source}</span>
              </p>
            )}

            <div className="alert-modal-actions">
              <button className="alert-modal-btn" onClick={closeModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
