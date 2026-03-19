import { motion } from 'framer-motion'

function GhostAvatar() {
  return (
    <motion.div
      animate={{
        y: [0, -7, 0],
        boxShadow: [
          '0 0 20px #8b5cf6',
          '0 0 34px rgba(139, 92, 246, 0.95)',
          '0 0 20px #8b5cf6',
        ],
      }}
      transition={{
        y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
        boxShadow: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        width: 80,
        height: 80,
        borderRadius: '40px 40px 22px 22px',
        background: '#ffffff',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          width: 10,
          height: 16,
          borderRadius: '50%',
          background: '#121212',
          display: 'inline-block',
        }}
      />
      <span
        style={{
          width: 10,
          height: 16,
          borderRadius: '50%',
          background: '#121212',
          display: 'inline-block',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: -2,
          left: 6,
          right: 6,
          height: 18,
          background: '#ffffff',
          borderRadius: '0 0 18px 18px / 0 0 12px 12px',
          clipPath:
            'polygon(0% 35%, 12% 88%, 25% 40%, 38% 88%, 50% 40%, 62% 88%, 75% 40%, 88% 88%, 100% 35%, 100% 100%, 0% 100%)',
        }}
      />
    </motion.div>
  )
}

export default GhostAvatar

