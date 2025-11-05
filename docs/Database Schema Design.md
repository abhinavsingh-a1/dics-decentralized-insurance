Below are table definitions (DDL) for core tables. Use them as starting migrations.

-- policies table
CREATE TABLE policies (
  policy_id BIGSERIAL PRIMARY KEY,
  policy_contract_address TEXT,        -- on-chain contract address or policy reference
  holder_address TEXT,                 -- wallet address of policyholder
  coverage JSONB,                      -- coverage metadata e.g., {"type":"car","limits":...}
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- claims table
CREATE TABLE claims (
  claim_id BIGSERIAL PRIMARY KEY,
  policy_id BIGINT REFERENCES policies(policy_id),
  onchain_claim_id BIGINT,             -- if contract returns numeric id
  claimant_address TEXT NOT NULL,
  amount NUMERIC(20,2) DEFAULT 0,
  merkle_root TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted, under_review, approved, paid, rejected
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  tx_hash TEXT,
  block_number BIGINT,
  metadata JSONB,                      -- optional additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- documents table
CREATE TABLE documents (
  doc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id BIGINT REFERENCES claims(claim_id),
  filename TEXT,
  file_cid TEXT,                       -- IPFS CID or S3 path
  sha256_hash TEXT,
  merkle_proof JSONB,                  -- array of proof hashes
  uploaded_by TEXT,                    -- wallet address or user id
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- oracle_responses table
CREATE TABLE oracle_responses (
  id BIGSERIAL PRIMARY KEY,
  claim_id BIGINT REFERENCES claims(claim_id),
  oracle_provider TEXT,
  response JSONB,
  response_hash TEXT,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- events table (on-chain events indexed)
CREATE TABLE chain_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT,
  event_data JSONB,
  tx_hash TEXT,
  block_number BIGINT,
  indexed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- audit logs
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT,
  action TEXT,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- simple indexes
CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_claims_claimant ON claims(claimant_address);
CREATE INDEX idx_docs_claim ON documents(claim_id);


Notes:

Use pgcrypto extension (for gen_random_uuid()) or adapt UUID generation.
Encrypt PII at rest if any; avoid storing sensitive PII on-chain.
Consider partitioning chain_events if high volume.