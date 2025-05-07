"use client"

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

// Validación más robusta de variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing environment variables for Supabase. Please check your .env.local file.'
    )
}

export function createClient() {
    return createBrowserClient<Database>(
        supabaseUrl,
        supabaseAnonKey
    )
}