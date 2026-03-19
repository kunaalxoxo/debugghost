import { motion } from 'framer-motion'

function GhostAvatar() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: '#ffffff',
        boxShadow: '0 0 18px rgba(139, 92, 246, 0.9), 0 0 40px rgba(139, 92, 246, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          width: 10,
          height: 15,
          borderRadius: '50%',
          background: '#111827',
          display: 'inline-block',
        }}
      />
      <span
        style={{
          width: 10,
          height: 15,
          borderRadius: '50%',
          background: '#111827',
          display: 'inline-block',
        }}
      />
    </motion.div>
  )
}

export default GhostAvatar

