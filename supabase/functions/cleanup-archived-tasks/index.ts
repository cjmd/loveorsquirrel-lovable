import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    console.log('Checking for archived tasks older than:', thirtyDaysAgo.toISOString())

    // Delete completed tasks that were completed more than 30 days ago
    const { data, error, count } = await supabase
      .from('tasks')
      .delete({ count: 'exact' })
      .eq('completed', true)
      .not('completed_at', 'is', null)
      .lt('completed_at', thirtyDaysAgo.toISOString())

    if (error) {
      console.error('Error deleting old archived tasks:', error)
      throw error
    }

    const deletedCount = count || 0
    console.log(`Successfully deleted ${deletedCount} archived tasks`)

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount,
        message: `Deleted ${deletedCount} archived tasks older than 30 days`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Cleanup error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})