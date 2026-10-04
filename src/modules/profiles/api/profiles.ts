// © Janus — yashxsanjay
import { supabase } from '@/core/supabase/client'
import type { Profile, Json } from '@/core/supabase/types'

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return data
}

export async function getProfileByHandle(handle: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .maybeSingle()
  return data
}

export async function isHandleAvailable(handle: string): Promise<boolean> {
  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('handle', handle)
  return count === 0
}

export async function createProfile(
  userId: string,
  data: {
    type: 'builder' | 'company'
    handle: string
    display_name: string
    bio?: string
  }
): Promise<Profile> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      type: data.type,
      handle: data.handle,
      display_name: data.display_name,
      bio: data.bio ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return profile
}

export async function updateProfile(
  id: string,
  data: {
    display_name?: string
    bio?: string
    links?: Json[]
  }
): Promise<Profile> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      display_name: data.display_name,
      bio: data.bio ?? null,
      links: data.links,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return profile
}
