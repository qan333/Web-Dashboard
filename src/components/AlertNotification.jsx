export default function AlertNotification({ message, type }) {
  const bgColor =
    {
      success: 'var(--success-color)',
      warning: 'var(--warning-color)',
      danger: 'var(--danger-color)',
      info: 'var(--info-color)',
    }[type] || 'var(--info-color)'

  return (
    // LAYER 1: Căn giữa, không animation, không đổi transform nữa
    <div
      style={{
        position: 'fixed',
        top: '24px',
        left: '55%',
        transform: 'translateX(-50%)',  // luôn giữ ở giữa
        zIndex: 10000,
        pointerEvents: 'none',          // để không chặn click dưới (tuỳ bạn)
      }}
    >
      {/* LAYER 2: Card thật, có bg, padding, animation */}
      <div
        style={{
          padding: '0.75rem 1.5rem',
          background: bgColor,
          color: 'white',
          borderRadius: '8px',
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          whiteSpace: 'nowrap',
          animation: 'slideIn 0.3s ease',
          pointerEvents: 'auto',        // nếu card có nút bấm thì giữ lại
        }}
      >
        {message}
      </div>
    </div>
  )
}
