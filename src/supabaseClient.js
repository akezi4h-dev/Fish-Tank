import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://oapoaftdssvuwqbwbxdk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcG9hZnRkc3N2dXdxYndieGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzU5NjEsImV4cCI6MjA5MjQ1MTk2MX0.X-l-eCqgXI5a-77v_vvGFMmLt_BjxHmsrje9wDNPdGI'
)
