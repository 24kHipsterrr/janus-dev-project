// © Janus — yashxsanjay
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Edit, ExternalLink } from 'lucide-react'
import { useUser } from '@/core/auth'
import { Button } from '@/shared/ui'
import { FullPageSpinner } from '@/shared/ui/Spinner'
import { getProfileByHandle } from '../api/profiles'
import type { Profile } from '@/core/supabase/types'
import { sanitizeUrl } from '@/shared/utils'

export default function ProfileViewPage() {
  const { handle } = useParams<{ handle: string }>()
  const user = useUser()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined)

  useEffect(() => {
    if (!handle) return
    getProfileByHandle(handle).then(setProfile)
  }, [handle])

  if (profile === undefined) return <FullPageSpinner />

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base text-center">
        <p className="text-text-muted">No profile found for @{handle}</p>
        <Button variant="ghost" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    )
  }

  const isOwn = user?.id === profile.user_id
  const links = (profile.links ?? []) as { label: string; url: string }[]

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full brand-gradient text-2xl font-bold text-white">
            {profile.display_name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">{profile.display_name}</h1>
            <p className="text-sm text-text-muted">@{profile.handle}</p>
            <span className="mt-1 inline-block rounded-full border border-border px-2 py-0.5 text-xs capitalize text-text-muted">
              {profile.type}
            </span>
          </div>
        </div>

        {isOwn ? (
          <Link to="/profile/edit">
            <Button variant="outline" size="sm">
              <Edit size={14} />
              Edit
            </Button>
          </Link>
        ) : null}
      </div>

      {/* Bio */}
      {profile.bio ? (
        <p className="mt-6 text-sm text-text leading-relaxed">{profile.bio}</p>
      ) : null}

      {/* Links */}
      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((link, i) => (
            <a
              key={i}
              href={sanitizeUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text hover:border-brand transition-colors"
            >
              <ExternalLink size={12} />
              {link.label || link.url}
            </a>
          ))}
        </div>
      ) : null}

      {/* Demos placeholder */}
      <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-text-muted text-sm">Demos coming soon</p>
        <p className="mt-1 text-xs text-text-muted opacity-60">
          {isOwn ? 'You will be able to post project demos here.' : `${profile.display_name}'s demos will appear here.`}
        </p>
      </div>
    </div>
  )
}
