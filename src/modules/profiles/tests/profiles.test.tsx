// © Janus — yashxsanjay
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/core/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

vi.mock('@/modules/profiles/api/profiles', () => ({
  getProfileByUserId: vi.fn().mockResolvedValue(null),
  getProfileByHandle: vi.fn().mockResolvedValue(null),
  isHandleAvailable: vi.fn().mockResolvedValue(true),
  createProfile: vi.fn().mockResolvedValue({
    id: '1',
    handle: 'testuser',
    display_name: 'Test',
    type: 'builder',
  }),
}))

async function renderSetupPage() {
  const { default: ProfileSetupPage } = await import('../components/ProfileSetupPage')
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(
      <MemoryRouter>
        <ProfileSetupPage />
      </MemoryRouter>
    )
  })
  return result!
}

describe('ProfileSetupPage', () => {
  it('renders the profile type selector', async () => {
    await renderSetupPage()
    expect(screen.getByText(/🔧 Builder/)).toBeInTheDocument()
    expect(screen.getByText(/🏢 Company/)).toBeInTheDocument()
  })

  it('shows handle and display name fields', async () => {
    await renderSetupPage()
    expect(screen.getByLabelText(/Handle/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Display name/i)).toBeInTheDocument()
  })

  it('shows min-length error for short handle on submit', async () => {
    const user = userEvent.setup()
    await renderSetupPage()

    await user.type(screen.getByLabelText(/Handle/i), 'ab')
    await user.click(screen.getByRole('button', { name: /Create profile/i }))

    await waitFor(() => {
      expect(screen.getByText(/At least 3 characters/i)).toBeInTheDocument()
    })
  })
})

describe('isHandleAvailable', () => {
  it('returns true for available handle (mocked)', async () => {
    const { isHandleAvailable } = await import('../api/profiles')
    const result = await isHandleAvailable('newhandle')
    expect(result).toBe(true)
  })
})
