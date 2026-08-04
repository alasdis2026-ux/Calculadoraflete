-- ============================================================
-- ALAS · Facturas por planilla semanal (transportista + semana)
-- Ejecutar en el SQL Editor del proyecto de Flete (wooihkyzpexxqkwwnylt).
-- Aditivo: no borra ni cambia datos existentes.
-- ============================================================

alter table fact_facturas add column if not exists semana_desde date;
alter table fact_facturas add column if not exists semana_hasta date;

create index if not exists idx_fact_facturas_semana on fact_facturas(semana_desde);
