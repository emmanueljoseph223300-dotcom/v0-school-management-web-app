-- Create term enum type
DO $$ BEGIN
  CREATE TYPE academic_term AS ENUM ('first', 'second', 'third');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create results table
CREATE TABLE IF NOT EXISTS public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  term academic_term NOT NULL,
  session TEXT NOT NULL, -- e.g., "2024/2025"
  ca_score DECIMAL(5,2) DEFAULT 0 CHECK (ca_score >= 0 AND ca_score <= 40),
  exam_score DECIMAL(5,2) DEFAULT 0 CHECK (exam_score >= 0 AND exam_score <= 60),
  total DECIMAL(5,2) GENERATED ALWAYS AS (ca_score + exam_score) STORED,
  grade TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN (ca_score + exam_score) >= 70 THEN 'A'
      WHEN (ca_score + exam_score) >= 60 THEN 'B'
      WHEN (ca_score + exam_score) >= 50 THEN 'C'
      WHEN (ca_score + exam_score) >= 45 THEN 'D'
      WHEN (ca_score + exam_score) >= 40 THEN 'E'
      ELSE 'F'
    END
  ) STORED,
  remarks TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_id, class_id, term, session)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_results_student ON public.results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_class ON public.results(class_id);
CREATE INDEX IF NOT EXISTS idx_results_subject ON public.results(subject_id);
CREATE INDEX IF NOT EXISTS idx_results_session_term ON public.results(session, term);

-- Enable Row Level Security
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
