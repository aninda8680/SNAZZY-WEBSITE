import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export default supabase
