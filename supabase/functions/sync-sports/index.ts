import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const oddsApiKey = Deno.env.get('ODDS_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!oddsApiKey) {
      throw new Error('ODDS_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch sports from Odds API
    console.log('Fetching sports from Odds API...');
    const sportsResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports?apiKey=${oddsApiKey}`
    );

    if (!sportsResponse.ok) {
      throw new Error(`Odds API error: ${sportsResponse.statusText}`);
    }

    const sports = await sportsResponse.json();
    console.log(`Fetched ${sports.length} sports`);

    // Insert or update sports in database
    for (const sport of sports) {
      const { error } = await supabase
        .from('sports')
        .upsert({
          key: sport.key,
          group_name: sport.group,
          title: sport.title,
          description: sport.description,
          active: sport.active,
          has_outrights: sport.has_outrights,
        }, {
          onConflict: 'key'
        });

      if (error) {
        console.error(`Error upserting sport ${sport.key}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: sports.length,
        message: 'Sports synced successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-sports:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});