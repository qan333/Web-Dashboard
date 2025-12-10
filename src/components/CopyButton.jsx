import { useState } from 'react'

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copy-btn ${copied ? 'copied' : ''} ${className}`}
      aria-label="Copy hash"
    >
      {/* icon giống kiểu copy của ChatGPT */}
      {!copied ? (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <rect x="5" y="5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <rect x="3" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="14" height="14" rx="3" fill="currentColor" />
          <path
            d="M7 10.5L9 12.5L13.5 8"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span className="copy-btn-label">
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  )
}
