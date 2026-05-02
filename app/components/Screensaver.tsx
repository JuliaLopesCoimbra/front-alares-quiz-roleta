interface ScreensaverProps {
  visible: boolean
  onClick: () => void
}

export function Screensaver({ visible, onClick }: ScreensaverProps) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[1100] cursor-pointer"
      style={{
        backgroundImage: 'url(/backgrounds/descanso.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={onClick}
    />
  )
}
