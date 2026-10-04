// © Janus — yashxsanjay
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base text-center">
      <p className="text-6xl font-bold brand-gradient-text">404</p>
      <p className="text-text-muted">This page does not exist.</p>
      <Link to="/" className="text-accent hover:underline text-sm">
        Go home
      </Link>
    </div>
  )
}
