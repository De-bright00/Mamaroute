CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.knowledge_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  source text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.knowledge_docs TO authenticated, anon;
GRANT ALL ON public.knowledge_docs TO service_role;

ALTER TABLE public.knowledge_docs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read knowledge" ON public.knowledge_docs
  FOR SELECT USING (true);

CREATE INDEX knowledge_docs_embedding_idx
  ON public.knowledge_docs
  USING hnsw ((embedding::halfvec(3072)) halfvec_cosine_ops);

CREATE OR REPLACE FUNCTION public.match_knowledge(
  query_embedding vector(3072),
  match_count int DEFAULT 4
)
RETURNS TABLE (
  id uuid,
  question text,
  answer text,
  source text,
  similarity float
)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT
    d.id,
    d.question,
    d.answer,
    d.source,
    1 - (d.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)) AS similarity
  FROM public.knowledge_docs d
  WHERE d.embedding IS NOT NULL
  ORDER BY d.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)
  LIMIT match_count;
$$;

GRANT EXECUTE ON FUNCTION public.match_knowledge(vector, int) TO anon, authenticated, service_role;