CREATE SCHEMA gostats;
DROP TABLE gostats.new_elements;
WITH aff_new AS (
    SELECT
      date_part('year', A.datecreated)  AS year,
      date_part('month', A.datecreated) AS month,
      count(*)                          AS NbreAff
    FROM affaire A
    GROUP BY date_part('month', A.datecreated), date_part('year', A.datecreated)
    ORDER BY year, month),
    suivi_new AS (
      SELECT
        date_part('year', A.datecreated)  AS year,
        date_part('month', A.datecreated) AS month,
        count(*)                          AS NbreSuivi
      FROM affaire_suivi A
      GROUP BY date_part('month', A.datecreated), date_part('year', A.datecreated)
      ORDER BY year, month),
    doc_new AS (
      SELECT
        date_part('year', D.datecreated)  AS year,
        date_part('month', D.datecreated) AS month,
        count(*)                          AS NbreDoc
      FROM document D
      GROUP BY date_part('month', D.datecreated), date_part('year', D.datecreated)
      ORDER BY year, month),
    thing_new AS (
      SELECT
        date_part('year', D.datecreated)  AS year,
        date_part('month', D.datecreated) AS month,
        count(*)                          AS NbreThing
      FROM thing D
      GROUP BY date_part('month', D.datecreated), date_part('year', D.datecreated)
      ORDER BY year, month),
    env_new AS (
      SELECT
        date_part('year', D.datecreated)  AS year,
        date_part('month', D.datecreated) AS month,
        count(*)                          AS NbreEnv
      FROM enveloppe D
      GROUP BY date_part('month', D.datecreated), date_part('year', D.datecreated)
      ORDER BY year, month),
    acteur_new AS (
      SELECT
        date_part('year', D.datecreated)  AS year,
        date_part('month', D.datecreated) AS month,
        count(*)                          AS NbreActeurs
      FROM acteur D
      GROUP BY date_part('month', D.datecreated), date_part('year', D.datecreated)
      ORDER BY year, month)
SELECT
  thing_new.year :: INT,
  thing_new.month :: INT,
  aff_new.NbreAff :: INT        AS n_affaires,
  suivi_new.NbreSuivi :: INT    AS n_suivis,
  doc_new.NbreDoc :: INT        AS n_documents,
  thing_new.NbreThing :: INT    AS n_things,
  env_new.NbreEnv :: INT        AS n_enveloppes,
  acteur_new.NbreActeurs :: INT AS n_acteurs
INTO gostats.new_elements
FROM thing_new
  FULL OUTER JOIN aff_new ON aff_new.year = thing_new.year AND aff_new.month = thing_new.month
  FULL OUTER JOIN suivi_new ON suivi_new.year = thing_new.year AND suivi_new.month = thing_new.month
  FULL OUTER JOIN doc_new ON doc_new.year = thing_new.year AND doc_new.month = thing_new.month
  FULL OUTER JOIN env_new ON env_new.year = thing_new.year AND env_new.month = thing_new.month
  FULL OUTER JOIN acteur_new ON acteur_new.year = thing_new.year AND acteur_new.month = thing_new.month
ORDER BY 1, 2;

ALTER TABLE gostats.new_elements
  ADD CONSTRAINT gostats_new_elements_year_month_pk
PRIMARY KEY (year, month);


-- to get "2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017
WITH all_years AS(
  SELECT year
  --, sum(n_affaires) as n_affaires
FROM gostats.new_elements WHERE year > 2002
  GROUP BY year
ORDER BY year)
SELECT string_agg(year::TEXT, '","') FROM all_years;



WITH all_years AS(
  SELECT sum(n_documents) as n_documents
FROM gostats.new_elements WHERE year > 2002
  GROUP BY year
ORDER BY year)
SELECT string_agg(n_documents::TEXT, ', ') FROM all_years;

