// © Janus — yashxsanjay
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUser } from '@/core/auth'
import { Button, Input, Label, Card } from '@/shared/ui'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import { getProfileByUserId, updateProfile } from '../api/profiles'
import type { Profile } from '@/core/supabase/types'

const schema = z.object({
  display_name: z.string().min(1, 'Required').max(64),
  bio: z.string().max(280).optional(),
})

type FormData = z.infer<typeof schema>

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const user = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!user) return
    getProfileByUserId(user.id).then((p) => {
      if (!p) { navigate('/profile/setup', { replace: true }); return }
      setProfile(p)
      reset({ display_name: p.display_name, bio: p.bio ?? '' })
      setLoading(false)
    })
  }, [user, navigate, reset])

  async function onSubmit(data: FormData) {
    if (!profile) return
    setServerError(null)
    setSaved(false)
    try {
      const updated = await updateProfile(profile.id, {
        display_name: data.display_name,
        bio: data.bio,
      })
      setProfile(updated)
      reset({ display_name: updated.display_name, bio: updated.bio ?? '' })
      setSaved(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (loading) return <FullPageSpinner />

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Edit profile</h1>
        <button
          onClick={() => navigate(`/profile/${profile?.handle}`)}
          className="text-sm text-text-muted hover:text-text"
        >
          View profile →
        </button>
      </div>

      <Card>
        {serverError ? (
          <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700 px-3 py-2 text-sm text-red-300">
            {serverError}
          </div>
        ) : null}

        {saved ? (
          <div className="mb-4 rounded-lg bg-green-900/30 border border-green-700 px-3 py-2 text-sm text-green-300">
            Profile updated.
          </div>
        ) : null}

        <div className="mb-4">
          <p className="text-sm text-text-muted">
            Handle: <span className="font-mono text-text">@{profile?.handle}</span>
            <span className="ml-2 text-xs text-text-muted">(handle cannot be changed)</span>
          </p>
          <p className="mt-1 text-sm text-text-muted capitalize">
            Account type: <span className="text-text">{profile?.type}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              error={errors.display_name?.message}
              {...register('display_name')}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="bio">Bio <span className="font-normal text-text-muted">(optional, max 280 chars)</span></Label>
            <textarea
              id="bio"
              maxLength={280}
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              {...register('bio')}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
              Save changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
