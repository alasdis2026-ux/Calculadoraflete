-- ============================================================
-- ALAS · Segmento predeterminado por camión
-- Ejecutar en el SQL Editor del proyecto de Flete (wooihkyzpexxqkwwnylt).
-- Agrega el segmento (local | interior | servicios) configurable por camión.
-- Aditivo: no borra ni cambia datos existentes.
-- ============================================================

alter table camiones add column if not exists segmento text not null default 'local';

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'camiones_segmento_chk') then
    alter table camiones add constraint camiones_segmento_chk check (segmento in ('local','interior','servicios'));
  end if;
end $$;
