CREATE TABLE job_store
(
  id uuid NOT NULL,
  name character varying(1024),
  failed boolean,
  fail_count integer,
  fail_message text,
  result json,
  CONSTRAINT job_store_pkey PRIMARY KEY (id )
)
WITH (
  OIDS=FALSE
);