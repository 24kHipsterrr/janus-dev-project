// © Janus — yashxsanjay
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUser } from '@/core/auth'
import { Button, Input, Label, Card } from '@/shared/ui'
import {
  createProfile,
  getProfileByUserId,
  isHandleAvailable,
} from '../api/profiles'

const schema = z.object({
  type: z.enum(['builder', 'company']),
  handle: z
    .string()
    .min(3, 'At least 3 characters')
    .max(32, 'At most 32 characters')
    .regex(/^[a-z0-9_-]+$/, 'Lowercase letters, numbers, _ and - only'),
  display_name: z.string().min(1, 'Required').max(64, 'At most 64 characters'),
  bio: z.string().max(280, 'At most 280 characters').optional(),
})

type FormData = z.infer<typeof schema>

export default function ProfileSetupPage() {
  const navigate = useNavigate()
  const user = useUser()
  const [serverError, setServerError] = useState<string | null>(null)

  // If profile already exists, redirect away
  useEffect(() => {
    if (!user) return
    getProfileByUserId(user.id).then((p) => {
      if (p) navigate('/', { replace: true })
    })
  }, [user, navigate])

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'builder' },
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    if (!user) return

    const available = await isHandleAvailable(data.handle)
    if (!available) {
      setServerError(`@${data.handle} is already taken. Choose a different handle.`)
      return
    }

    try {
      await createProfile(user.id, {
        type: data.type,
        handle: data.handle,
        display_name: data.display_name,
        bio: data.bio,
      })
      navigate('/', { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold brand-gradient-text">Janus</h1>
          <p className="mt-1 text-sm text-text-muted">Set up your profile to get started</p>
        </div>

        <Card>
          <h2 className="mb-5 text-lg font-semibold text-text">Create your profile</h2>

          {serverError ? (
            <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700 px-3 py-2 text-sm text-red-300">
              {serverError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Profile type */}
            <div className="space-y-2">
              <Label>I am a…</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-3">
                    {(['builder', 'company'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => field.onChange(t)}
                        className={[
                          'flex-1 rounded-lg border py-3 text-sm font-medium capitalize transition-colors',
                          field.value === t
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-border text-text-muted hover:border-brand/50',
                        ].join(' ')}
                      >
                        {t === 'builder' ? '🔧 Builder' : '🏢 Company'}
                      </button>
                    ))}
                  </div>
                )}
              />
              {errors.type ? (
                <p className="text-xs text-red-400">{errors.type.message}</p>
              ) : null}
            </div>

            {/* Handle */}
            <div className="space-y-1">
              <Label htmlFor="handle">Handle (username)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-text-muted">@</span>
                <Input
                  id="handle"
                  className="pl-7"
                  placeholder="yourhandle"
                  autoComplete="off"
                  error={errors.handle?.message}
                  {...register('handle', {
                    onChange: (e) => {
                      e.target.value = e.target.value.toLowerCase()
                    },
                  })}
                />
              </div>
            </div>

            {/* Display name */}
            <div className="space-y-1">
              <Label htmlFor="display_name">Display name</Label>
              <Input
                id="display_name"
                placeholder={getValues('type') === 'company' ? 'Acme Inc.' : 'Your Name'}
                error={errors.display_name?.message}
                {...register('display_name')}
              />
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <Label htmlFor="bio">Bio <span className="text-text-muted font-normal">(optional)</span></Label>
              <textarea
                id="bio"
                placeholder="What are you building?"
                maxLength={280}
                className={[
                  'w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted',
                  'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
                  errors.bio ? 'border-red-500' : '',
                ].join(' ')}
                rows={3}
                {...register('bio')}
              />
              {errors.bio ? <p className="text-xs text-red-400">{errors.bio.message}</p> : null}
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create profile
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
