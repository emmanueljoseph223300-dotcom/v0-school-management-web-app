-- Create level enum type
DO $$ BEGIN
  CREATE TYPE class_level AS ENUM ('junior', 'senior');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  level class_level NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint to profiles for class_id
ALTER TABLE public.profiles 
  ADD CONSTRAINT fk_profiles_class 
  FOREIGN KEY (class_id) 
  REFERENCES public.classes(id) 
  ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
