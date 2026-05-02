interface ScreenBackgroundProps {
  src: string
  children?: React.ReactNode
  onClick?: () => void
}

export function ScreenBackground({ src, children, onClick }: ScreenBackgroundProps) {
  return (
    <div
      className={`relative w-screen h-screen overflow-hidden${onClick ? ' cursor-pointer' : ''}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
