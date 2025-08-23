-- Create podcasts table for storing AI-generated city history podcasts
CREATE TABLE IF NOT EXISTS podcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(6) UNIQUE NOT NULL, -- 6-character access code
  city_name VARCHAR(255) NOT NULL,
  title VARCHAR(500),
  description TEXT,
  audio_url TEXT,
  script_content TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on code for fast lookups
CREATE INDEX IF NOT EXISTS idx_podcasts_code ON podcasts(code);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_podcasts_status ON podcasts(status);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_podcasts_created_at ON podcasts(created_at DESC);

-- Function to generate random 6-character codes
CREATE OR REPLACE FUNCTION generate_podcast_code()
RETURNS VARCHAR(6) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result VARCHAR(6) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate unique codes
CREATE OR REPLACE FUNCTION set_podcast_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code VARCHAR(6);
  code_exists BOOLEAN;
BEGIN
  -- Only generate code if not provided
  IF NEW.code IS NULL OR NEW.code = '' THEN
    LOOP
      new_code := generate_podcast_code();
      SELECT EXISTS(SELECT 1 FROM podcasts WHERE code = new_code) INTO code_exists;
      EXIT WHEN NOT code_exists;
    END LOOP;
    NEW.code := new_code;
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate codes
DROP TRIGGER IF EXISTS trigger_set_podcast_code ON podcasts;
CREATE TRIGGER trigger_set_podcast_code
  BEFORE INSERT OR UPDATE ON podcasts
  FOR EACH ROW
  EXECUTE FUNCTION set_podcast_code();
