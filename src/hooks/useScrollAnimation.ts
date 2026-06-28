import { useEffect, useCallback } from 'react'

interface UseScrollAnimationProps {
  onScroll?: (scrolled: boolean) => void
  threshold?: number
}

/**
 * Hook for detecting scroll position and triggering callbacks
 */
export const useScrollAnimation = ({
  onScroll,
  threshold = 50,
}: UseScrollAnimationProps) => {
  const handleScroll = useCallback(() => {
    if (onScroll) {
      onScroll(window.scrollY > threshold)
    }
  }, [onScroll, threshold])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])
}
