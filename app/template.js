'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAccessibleMotion, transitions } from '@/lib/motion';

export default function Template({ children }) {
  const pathname = usePathname();
  
  const motionProps = useAccessibleMotion({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: transitions.easeOut
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} {...motionProps} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
