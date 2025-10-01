-- Create sports table
CREATE TABLE public.sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  group_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  has_outrights BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id TEXT PRIMARY KEY,
  sport_key TEXT NOT NULL REFERENCES public.sports(key) ON DELETE CASCADE,
  sport_title TEXT NOT NULL,
  commence_time TIMESTAMPTZ NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookmakers table
CREATE TABLE public.bookmakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create odds table
CREATE TABLE public.odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  bookmaker_key TEXT NOT NULL REFERENCES public.bookmakers(key) ON DELETE CASCADE,
  market_key TEXT NOT NULL,
  last_update TIMESTAMPTZ NOT NULL,
  outcomes JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_events_sport_key ON public.events(sport_key);
CREATE INDEX idx_events_commence_time ON public.events(commence_time);
CREATE INDEX idx_events_completed ON public.events(completed);
CREATE INDEX idx_odds_event_id ON public.odds(event_id);
CREATE INDEX idx_odds_bookmaker_key ON public.odds(bookmaker_key);
CREATE INDEX idx_odds_market_key ON public.odds(market_key);

-- Enable RLS
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odds ENABLE ROW LEVEL SECURITY;

-- Create policies (read-only for all users)
CREATE POLICY "Sports are viewable by everyone"
  ON public.sports FOR SELECT
  USING (true);

CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Bookmakers are viewable by everyone"
  ON public.bookmakers FOR SELECT
  USING (true);

CREATE POLICY "Odds are viewable by everyone"
  ON public.odds FOR SELECT
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_sports_updated_at
  BEFORE UPDATE ON public.sports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_odds_updated_at
  BEFORE UPDATE ON public.odds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();