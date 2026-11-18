-- ============================================================
-- ALAS · Motivo de cambio en facturas
-- Ejecutar en el SQL Editor del proyecto de Flete.
-- Aditivo: no borra ni cambia datos existentes.
-- ============================================================

-- Último motivo registrado (para mostrarlo en la lista sin abrir la fila).
alter table fact_facturas add column if not exists motivo_cambio text;
alter table fact_facturas add column if not exists motivo_nota   text;
alter table fact_facturas add column if not exists cambiada_at   timestamptz;

-- Historial completo. Cada entrada:
--   { ts, usuario, motivo, nota, campos:[{k,l,de,a}] }
-- motivo ∈ ('precio','escrita','reparto','fecha')
alter table fact_facturas add column if not exists cambios jsonb default '[]'::jsonb;

update fact_facturas set cambios = '[]'::jsonb where cambios is null;

create index if not exists idx_fact_facturas_motivo on fact_facturas(motivo_cambio);
