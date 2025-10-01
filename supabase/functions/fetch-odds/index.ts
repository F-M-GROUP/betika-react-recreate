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
    const { sportKey } = await req.json();
    
    const oddsApiKey = Deno.env.get('ODDS_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!oddsApiKey) {
      throw new Error('ODDS_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine which sport to fetch
    const sport = sportKey || 'upcoming';
    
    console.log(`Fetching odds for ${sport}...`);
    
    // Fetch odds from Odds API
    const oddsResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${oddsApiKey}&regions=us,uk,eu&markets=h2h&oddsFormat=decimal`
    );

    if (!oddsResponse.ok) {
      throw new Error(`Odds API error: ${oddsResponse.statusText}`);
    }

    const oddsData = await oddsResponse.json();
    console.log(`Fetched ${oddsData.length} events`);

    // Store events and odds
    for (const event of oddsData) {
      // Upsert event
      const { error: eventError } = await supabase
        .from('events')
        .upsert({
          id: event.id,
          sport_key: event.sport_key,
          sport_title: event.sport_title,
          commence_time: event.commence_time,
          home_team: event.home_team,
          away_team: event.away_team,
          completed: false,
        }, {
          onConflict: 'id'
        });

      if (eventError) {
        console.error(`Error upserting event ${event.id}:`, eventError);
        continue;
      }

      // Store bookmakers and odds
      for (const bookmaker of event.bookmakers || []) {
        // Upsert bookmaker
        await supabase
          .from('bookmakers')
          .upsert({
            key: bookmaker.key,
            title: bookmaker.title,
          }, {
            onConflict: 'key'
          });

        // Store odds for each market
        for (const market of bookmaker.markets || []) {
          await supabase
            .from('odds')
            .upsert({
              event_id: event.id,
              bookmaker_key: bookmaker.key,
              market_key: market.key,
              last_update: bookmaker.last_update,
              outcomes: market.outcomes,
            }, {
              onConflict: 'event_id,bookmaker_key,market_key',
              ignoreDuplicates: false
            });
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: oddsData.length,
        message: 'Odds fetched and stored successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-odds:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});