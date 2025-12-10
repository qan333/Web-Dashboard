// src/components/DisconnectWalletModal.jsx
import '../styles/wallet-modal.css'

export default function DisconnectWalletModal({
  isOpen,
  onClose,
  onConfirm,
  walletAddress,
}) {
  if (!isOpen) return null

  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : ''

  return (
    <div className="wallet-modal-backdrop" onClick={onClose}>
      <div
        className="wallet-modal wallet-modal--small"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wallet-modal-header">
          <h3>Disconnect wallet</h3>
          <button className="wallet-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="wallet-modal-body-text">
          Are you sure you want to disconnect wallet{' '}
          {shortAddr && <strong>{shortAddr}</strong>}?
        </p>

        <div className="wallet-modal-actions">
          <button className="btn-disconnect" onClick={onConfirm}>
            Disconnect
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
