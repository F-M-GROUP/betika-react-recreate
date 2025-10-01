import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  isPopular?: boolean;
}

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      // Fetch events with their odds
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          odds (
            bookmaker_key,
            market_key,
            outcomes,
            last_update
          )
        `)
        .eq('completed', false)
        .order('commence_time', { ascending: true })
        .limit(50);

      if (eventsError) throw eventsError;

      // Transform data to Match format
      const matches: Match[] = (events || []).map(event => {
        // Calculate average odds from all bookmakers
        const h2hOdds = event.odds.filter((o: any) => o.market_key === 'h2h');
        
        let homeOdds = 0;
        let awayOdds = 0;
        let drawOdds = 0;
        let count = 0;

        h2hOdds.forEach((odd: any) => {
          const outcomes = odd.outcomes;
          if (outcomes && Array.isArray(outcomes)) {
            const home = outcomes.find((o: any) => o.name === event.home_team);
            const away = outcomes.find((o: any) => o.name === event.away_team);
            const draw = outcomes.find((o: any) => o.name === 'Draw');

            if (home) homeOdds += home.price;
            if (away) awayOdds += away.price;
            if (draw) drawOdds += draw.price;
            if (home || away) count++;
          }
        });

        const avgHome = count > 0 ? homeOdds / count : 2.0;
        const avgAway = count > 0 ? awayOdds / count : 2.0;
        const avgDraw = drawOdds > 0 ? drawOdds / count : undefined;

        // Determine status
        const commenceTime = new Date(event.commence_time);
        const now = new Date();
        const isLive = commenceTime < now && !event.completed;
        const status: 'upcoming' | 'live' | 'finished' = 
          isLive ? 'live' : event.completed ? 'finished' : 'upcoming';

        // Format time
        let time: string;
        if (isLive) {
          const minutesElapsed = Math.floor((now.getTime() - commenceTime.getTime()) / 60000);
          time = `LIVE ${Math.min(minutesElapsed, 90)}'`;
        } else {
          time = commenceTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        }

        return {
          id: event.id,
          homeTeam: event.home_team,
          awayTeam: event.away_team,
          league: event.sport_title,
          time,
          status,
          odds: {
            home: Number(avgHome.toFixed(2)),
            draw: avgDraw ? Number(avgDraw.toFixed(2)) : undefined,
            away: Number(avgAway.toFixed(2)),
          },
          isPopular: count > 3, // Mark as popular if multiple bookmakers
        };
      });

      return matches;
    },
    refetchInterval: 60000, // Refetch every minute
  });
};