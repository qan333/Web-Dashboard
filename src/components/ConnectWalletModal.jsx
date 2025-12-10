// src/components/ConnectWalletModal.jsx
import '../styles/wallet-modal.css'

export default function ConnectWalletModal({
  isOpen,
  onClose,
  onSelectWallet,   // (type: 'walletconnect'|'brave'|'metamask'|'any')
  isConnecting,
}) {
  if (!isOpen) return null

  const handleClick = (type) => {
    if (isConnecting) return
    onSelectWallet(type)
  }

  return (
    <div className="wallet-modal-backdrop" onClick={onClose}>
      <div
        className="wallet-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wallet-modal-header">
          <h3>Connect Wallet</h3>
          <button className="wallet-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="wallet-modal-list">
          <button
            className="wallet-option"
            onClick={() => handleClick('walletconnect')}
          >
            <div className="wallet-option-left">
              <div className="wallet-icon wallet-icon--wc">WC</div>
              <span>WalletConnect</span>
            </div>
            <span className="wallet-option-tag">QR CODE</span>
          </button>

          <button
            className="wallet-option"
            onClick={() => handleClick('brave')}
          >
            <div className="wallet-option-left">
              <div className="wallet-icon wallet-icon--brave">B</div>
              <span>Brave Wallet</span>
            </div>
            <span className="wallet-option-tag wallet-option-tag--installed">
              INSTALLED
            </span>
          </button>

          <button
            className="wallet-option"
            onClick={() => handleClick('metamask')}
          >
            <div className="wallet-option-left">
              <div className="wallet-icon wallet-icon--metamask">M</div>
              <span>MetaMask</span>
            </div>
            <span className="wallet-option-tag wallet-option-tag--installed">
              INSTALLED
            </span>
          </button>

          <button
            className="wallet-option"
            onClick={() => handleClick('any')}
          >
            <div className="wallet-option-left">
              <div className="wallet-icon wallet-icon--all">+</div>
              <span>All Wallets</span>
            </div>
            <span className="wallet-option-tag">500+</span>
          </button>
        </div>

        {isConnecting && (
          <p className="wallet-modal-footer-text">
            Confirm the connection in your wallet...
          </p>
        )}
      </div>
    </div>
  )
}
