const canVibrate = () => typeof navigator !== 'undefined' && 'vibrate' in navigator

export function useHaptic() {
  const confirm = () => canVibrate() && navigator.vibrate(55)
  const skip = () => canVibrate() && navigator.vibrate([30, 45, 30])
  const undo = () => canVibrate() && navigator.vibrate(20)
  return { confirm, skip, undo }
}
