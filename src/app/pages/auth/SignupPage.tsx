// © Janus — yashxsanjay
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Github } from 'lucide-react'
import { auth } from '@/core/auth'
import { Button, Input, Label, Card } from '@/shared/ui'

const schema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'github' | 'google' | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const { error } = await auth.signUpWithEmail(data.email, data.password)
    if (error) {
      setServerError(error.message)
      return
    }
    setSuccess(true)
  }

  async function handleOAuth(provider: 'github' | 'google') {
    setOauthLoading(provider)
    const fn = provider === 'github' ? auth.signInWithGitHub : auth.signInWithGoogle
    const { error } = await fn()
    if (error) {
      setServerError(error.message)
      setOauthLoading(null)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base px-4">
        <Card className="w-full max-w-sm text-center">
          <div className="mb-3 text-4xl">✉️</div>
          <h2 className="text-lg font-semibold text-text">Check your email</h2>
          <p className="mt-2 text-sm text-text-muted">
            We sent a verification link. Click it to activate your account, then come back to set up your profile.
          </p>
          <Link to="/login" className="mt-4 inline-block text-sm text-accent hover:underline">
            Back to sign in
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold brand-gradient-text">Janus</h1>
          <p className="mt-1 text-sm text-text-muted">Proof of work → hiring.</p>
        </div>

        <Card>
          <h2 className="mb-1 text-lg font-semibold text-text">Create account</h2>
          <p className="mb-5 text-xs text-text-muted">18+ only. By signing up you agree to our Terms.</p>

          {serverError ? (
            <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700 px-3 py-2 text-sm text-red-300">
              {serverError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.confirm?.message}
                {...register('confirm')}
              />
            </div>
            {/* Turnstile placeholder — wire up VITE_TURNSTILE_SITE_KEY before launch */}
            <p className="text-xs text-text-muted">Bot protection: Cloudflare Turnstile (configure before launch)</p>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create account
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface px-2 text-text-muted">or sign up with</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth('github')}
              loading={oauthLoading === 'github'}
              type="button"
            >
              <Github size={16} />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuth('google')}
              loading={oauthLoading === 'google'}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          </div>
        </Card>

        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
