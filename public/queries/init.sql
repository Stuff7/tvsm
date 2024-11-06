/* INIT */
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS shows CASCADE;
DROP TABLE IF EXISTS tags;

CREATE TABLE tags (
  id SERIAL PRIMARY KEY CHECK (id = 1),
  data JSONB NOT NULL
);
INSERT INTO tags (id, data) VALUES (1, '{}');

CREATE TABLE episodes (
  id SERIAL PRIMARY KEY,
  show_id INTEGER,
  image_medium VARCHAR(255),
  image_original VARCHAR(255),
  name VARCHAR(255),
  number INTEGER,
  rating DECIMAL(3, 1),
  released DATE,
  season INTEGER,
  summary TEXT
);

CREATE TABLE shows (
  id SERIAL PRIMARY KEY,
  image_medium VARCHAR(255),
  image_original VARCHAR(255),
  name VARCHAR(255),
  network VARCHAR(255),
  premiered DATE,
  rating DECIMAL(3, 1),
  status VARCHAR(50),
  summary TEXT,
  seasons INTEGER,
  next_ep_id INTEGER,
  prev_ep_id INTEGER
);

ALTER TABLE episodes
  ADD CONSTRAINT fk_show
  FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;

ALTER TABLE shows
  ADD CONSTRAINT fk_next_ep
  FOREIGN KEY (next_ep_id) REFERENCES episodes(id) ON DELETE SET NULL;

ALTER TABLE shows
  ADD CONSTRAINT fk_prev_ep
  FOREIGN KEY (prev_ep_id) REFERENCES episodes(id) ON DELETE SET NULL;

/* Delete function */
DROP FUNCTION IF EXISTS delete_shows(INTEGER[]);

CREATE OR REPLACE FUNCTION delete_shows(param_ids INTEGER[])
RETURNS VOID AS $$
BEGIN
  DELETE FROM shows WHERE id = ANY(param_ids);
END;
$$ LANGUAGE plpgsql;

/* Upsert function */
DROP FUNCTION IF EXISTS upsert_show_and_episodes(jsonb[], jsonb[]);

CREATE OR REPLACE FUNCTION upsert_show_and_episodes(
  param_updates jsonb[],  -- Array of show updates
  param_episodes jsonb[]
)
RETURNS VOID AS $$
DECLARE
  update_entry jsonb;
  episode_entry jsonb;
BEGIN
  -- Upsert the shows (excluding prev_ep_id and next_ep_id)
  FOREACH update_entry IN ARRAY param_updates
  LOOP
    EXECUTE format(
      'INSERT INTO shows (id, name, network, premiered, rating, status, summary, seasons, image_medium, image_original)
       VALUES (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         network = EXCLUDED.network,
         premiered = EXCLUDED.premiered,
         rating = EXCLUDED.rating,
         status = EXCLUDED.status,
         summary = EXCLUDED.summary,
         seasons = EXCLUDED.seasons,
         image_medium = EXCLUDED.image_medium,
         image_original = EXCLUDED.image_original',
      update_entry->>'id', update_entry->>'name', update_entry->>'network',
      update_entry->>'premiered', update_entry->>'rating', update_entry->>'status',
      update_entry->>'summary', update_entry->>'seasons',
      update_entry->>'image_medium', update_entry->>'image_original'
    );
  END LOOP;

  FOREACH episode_entry IN ARRAY param_episodes
  LOOP
    EXECUTE format(
      'INSERT INTO episodes (id, show_id, name, number, rating, released, season, summary, image_medium, image_original)
       VALUES (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L)
       ON CONFLICT (id) DO UPDATE SET
         show_id = EXCLUDED.show_id,
         name = EXCLUDED.name,
         number = EXCLUDED.number,
         rating = EXCLUDED.rating,
         released = EXCLUDED.released,
         season = EXCLUDED.season,
         summary = EXCLUDED.summary,
         image_medium = EXCLUDED.image_medium,
         image_original = EXCLUDED.image_original',
      episode_entry->>'id', episode_entry->>'show_id', episode_entry->>'name',
      episode_entry->>'number', episode_entry->>'rating', episode_entry->>'released',
      episode_entry->>'season', episode_entry->>'summary', episode_entry->>'image_medium',
      episode_entry->>'image_original'
    );
  END LOOP;

  -- Update the prev_ep_id and next_ep_id
  FOREACH update_entry IN ARRAY param_updates
  LOOP
    EXECUTE format(
      'UPDATE shows SET prev_ep_id = %L, next_ep_id = %L WHERE id = %L',
      update_entry->>'prev_ep_id', update_entry->>'next_ep_id', update_entry->>'id'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

/* Select all function */
DROP FUNCTION IF EXISTS all_shows();

CREATE OR REPLACE FUNCTION all_shows()
RETURNS TABLE (
  id INT,
  image JSON,
  name VARCHAR,
  network VARCHAR,
  premiered DATE,
  rating DECIMAL,
  status VARCHAR,
  summary TEXT,
  episodes JSON,
  "prevEp" JSON,
  "nextEp" JSON,
  seasons INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    json_build_object(
      'medium', s.image_medium,
      'original', s.image_original
    ) AS image,
    s.name,
    s.network,
    s.premiered,
    s.rating,
    s.status,
    s.summary,
    json_agg(json_build_object(
      'id', e.id,
      'image', json_build_object(
        'medium', e.image_medium,
        'original', e.image_original
      ),
      'name', e.name,
      'number', e.number,
      'rating', e.rating,
      'released', e.released,
      'season', e.season,
      'summary', e.summary
    )) AS episodes,
    CASE
      WHEN prev_ep.id IS NOT NULL THEN json_build_object(
        'id', prev_ep.id,
        'image', json_build_object(
          'medium', prev_ep.image_medium,
          'original', prev_ep.image_original
        ),
        'name', prev_ep.name,
        'number', prev_ep.number,
        'rating', prev_ep.rating,
        'released', prev_ep.released,
        'season', prev_ep.season,
        'summary', prev_ep.summary
      )
      ELSE NULL
    END AS "prevEp",
    CASE
      WHEN next_ep.id IS NOT NULL THEN json_build_object(
        'id', next_ep.id,
        'image', json_build_object(
          'medium', next_ep.image_medium,
          'original', next_ep.image_original
        ),
        'name', next_ep.name,
        'number', next_ep.number,
        'rating', next_ep.rating,
        'released', next_ep.released,
        'season', next_ep.season,
        'summary', next_ep.summary
      )
      ELSE NULL
    END AS "nextEp",
    s.seasons
  FROM shows s
  LEFT JOIN episodes e ON s.id = e.show_id
  LEFT JOIN episodes prev_ep ON s.prev_ep_id = prev_ep.id
  LEFT JOIN episodes next_ep ON s.next_ep_id = next_ep.id
  GROUP BY s.id, prev_ep.id, next_ep.id;
END;
$$ LANGUAGE plpgsql;
