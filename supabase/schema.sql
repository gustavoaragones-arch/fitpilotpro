CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  business_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  language TEXT DEFAULT 'en-US',
  stripe_customer_id TEXT UNIQUE,
  subscription_tier TEXT DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'professional', 'elite', 'studio')),
  subscription_status TEXT DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  subscription_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  mileage_rate DECIMAL(5,4) DEFAULT 0.67,
  default_session_duration INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTS
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  avatar_url TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  goal TEXT,
  health_conditions TEXT,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_location TEXT CHECK (preferred_location IN ('home', 'gym', 'studio', 'park', 'online', 'other')),
  session_price DECIMAL(10,2) DEFAULT 0,
  sessions_per_week DECIMAL(3,1) DEFAULT 1,
  payment_model TEXT DEFAULT 'per_session'
    CHECK (payment_model IN ('per_session', 'monthly', 'upfront')),
  attendance_rate DECIMAL(5,2) DEFAULT 100
    CHECK (attendance_rate BETWEEN 0 AND 100),
  tier TEXT DEFAULT 'silver' CHECK (tier IN ('diamond', 'gold', 'silver')),
  tier_score DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXERCISES
CREATE TABLE exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  muscle_groups TEXT[],
  equipment TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  instructions TEXT,
  video_url TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  wger_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROUTINES
CREATE TABLE routines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  focus_area TEXT,
  goal TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER DEFAULT 60,
  warm_up TEXT,
  cool_down TEXT,
  notes TEXT,
  tags TEXT[],
  is_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROUTINE EXERCISES (join table, ordered)
CREATE TABLE routine_exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  routine_id UUID REFERENCES routines(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  sets INTEGER,
  reps TEXT,
  duration_seconds INTEGER,
  rest_seconds INTEGER DEFAULT 90,
  weight_notes TEXT,
  notes TEXT
);

-- CLIENT ↔ ROUTINE assignments
CREATE TABLE client_routines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  routine_id UUID REFERENCES routines(id) ON DELETE CASCADE NOT NULL,
  assigned_days TEXT[],
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, routine_id)
);

-- SESSIONS
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  routine_id UUID REFERENCES routines(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  location_type TEXT CHECK (location_type IN ('home', 'gym', 'studio', 'park', 'online', 'other')),
  price DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid', 'waived')),
  payment_method TEXT,
  status TEXT DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  cancellation_reason TEXT,
  notes TEXT,
  trainer_notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  recurrence_group_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  status TEXT DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  notes TEXT,
  quickbooks_sync_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROGRESS RECORDS
CREATE TABLE progress_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_lbs DECIMAL(6,2),
  body_fat_pct DECIMAL(5,2),
  skeletal_muscle_mass_lbs DECIMAL(6,2),
  visceral_fat_level INTEGER,
  body_water_pct DECIMAL(5,2),
  bmi DECIMAL(5,2),
  chest_in DECIMAL(5,2),
  waist_in DECIMAL(5,2),
  hips_in DECIMAL(5,2),
  left_arm_in DECIMAL(5,2),
  right_arm_in DECIMAL(5,2),
  left_thigh_in DECIMAL(5,2),
  right_thigh_in DECIMAL(5,2),
  left_calf_in DECIMAL(5,2),
  right_calf_in DECIMAL(5,2),
  photo_front_url TEXT,
  photo_side_url TEXT,
  photo_back_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_clients" ON clients FOR ALL USING (auth.uid() = trainer_id);
CREATE POLICY "exercises_read" ON exercises FOR SELECT USING (trainer_id IS NULL OR auth.uid() = trainer_id);
CREATE POLICY "exercises_write" ON exercises FOR INSERT WITH CHECK (auth.uid() = trainer_id);
CREATE POLICY "exercises_update" ON exercises FOR UPDATE USING (auth.uid() = trainer_id);
CREATE POLICY "exercises_delete" ON exercises FOR DELETE USING (auth.uid() = trainer_id);
CREATE POLICY "own_routines" ON routines FOR ALL USING (auth.uid() = trainer_id);
CREATE POLICY "own_routine_exercises" ON routine_exercises FOR ALL
  USING (EXISTS (SELECT 1 FROM routines r WHERE r.id = routine_exercises.routine_id AND r.trainer_id = auth.uid()));
CREATE POLICY "own_client_routines" ON client_routines FOR ALL
  USING (EXISTS (SELECT 1 FROM clients c WHERE c.id = client_routines.client_id AND c.trainer_id = auth.uid()));
CREATE POLICY "own_sessions" ON sessions FOR ALL USING (auth.uid() = trainer_id);
CREATE POLICY "own_payments" ON payments FOR ALL USING (auth.uid() = trainer_id);
CREATE POLICY "own_progress" ON progress_records FOR ALL USING (auth.uid() = trainer_id);

-- TIER CALCULATOR TRIGGER
CREATE OR REPLACE FUNCTION calculate_client_tier()
RETURNS TRIGGER AS $$
DECLARE
  score DECIMAL;
BEGIN
  score :=
    CASE WHEN NEW.session_price >= 100 THEN 40 WHEN NEW.session_price >= 60 THEN 24 ELSE 12 END +
    CASE WHEN NEW.sessions_per_week > 3 THEN 30 WHEN NEW.sessions_per_week >= 2 THEN 18 ELSE 9 END +
    CASE WHEN NEW.payment_model = 'upfront' THEN 20 WHEN NEW.payment_model = 'monthly' THEN 12 ELSE 6 END +
    CASE WHEN NEW.attendance_rate >= 90 THEN 10 WHEN NEW.attendance_rate >= 70 THEN 5 ELSE 0 END;

  NEW.tier_score := score;
  NEW.tier := CASE WHEN score >= 70 THEN 'diamond' WHEN score >= 40 THEN 'gold' ELSE 'silver' END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_tier
  BEFORE INSERT OR UPDATE OF session_price, sessions_per_week, payment_model, attendance_rate
  ON clients FOR EACH ROW EXECUTE FUNCTION calculate_client_tier();

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON routines FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- INDEXES
CREATE INDEX idx_clients_trainer ON clients(trainer_id);
CREATE INDEX idx_clients_tier ON clients(trainer_id, tier);
CREATE INDEX idx_sessions_trainer ON sessions(trainer_id);
CREATE INDEX idx_sessions_date ON sessions(trainer_id, scheduled_at);
CREATE INDEX idx_payments_trainer ON payments(trainer_id);
CREATE INDEX idx_progress_client ON progress_records(client_id);
