-- Vethogar audit: schema gaps + broken profile/verification flows
-- Run in Supabase SQL Editor.

begin;

create temporary table if not exists audit_findings (
  severity text,
  check_name text,
  entity_id text,
  details text
) on commit drop;

-- 1) Schema checks expected by current app code
with required_columns as (
  select * from (
    values
      ('public','profiles','status'),
      ('public','profiles','is_public'),
      ('public','profiles','approved_at'),

      ('public','verification_requests','submitted_at'),
      ('public','verification_requests','review_message'),
      ('public','verification_requests','reviewed_by'),

      ('public','vet_profiles','home_service_areas'),
      ('public','vet_profiles','other_universities'),
      ('public','vet_profiles','other_specialties'),
      ('public','vet_profiles','publication_links'),
      ('public','vet_profiles','professional_card_file_url'),
      ('public','vet_profiles','specialty_documents'),
      ('public','vet_profiles','profile_photo_url'),
      ('public','vet_profiles','professional_photos'),
      ('public','vet_profiles','image_url'),

      ('public','clinic_profiles','addresses'),
      ('public','clinic_profiles','rut_file_url'),
      ('public','clinic_profiles','logo_url'),
      ('public','clinic_profiles','service_documents'),
      ('public','clinic_profiles','compliance_documents')
  ) as t(table_schema, table_name, column_name)
), existing_columns as (
  select table_schema, table_name, column_name
  from information_schema.columns
)
insert into audit_findings(severity, check_name, entity_id, details)
select
  'error',
  'missing_column',
  rc.table_schema || '.' || rc.table_name,
  'Missing column: ' || rc.column_name
from required_columns rc
left join existing_columns ec
  on ec.table_schema = rc.table_schema
 and ec.table_name = rc.table_name
 and ec.column_name = rc.column_name
where ec.column_name is null;

-- verification_status enum should include changes_requested
insert into audit_findings(severity, check_name, entity_id, details)
select
  'error',
  'missing_enum_value',
  'public.verification_status',
  'Missing enum label: changes_requested'
where not exists (
  select 1
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public'
    and t.typname = 'verification_status'
    and e.enumlabel = 'changes_requested'
);

-- 2) Base data integrity (works with baseline schema)
insert into audit_findings(severity, check_name, entity_id, details)
select
  'error',
  'missing_vet_profile',
  p.id::text,
  'profiles.role=vet without row in vet_profiles'
from public.profiles p
left join public.vet_profiles v on v.id = p.id
where p.role = 'vet' and v.id is null;

insert into audit_findings(severity, check_name, entity_id, details)
select
  'error',
  'missing_clinic_profile',
  p.id::text,
  'profiles.role=clinic without row in clinic_profiles'
from public.profiles p
left join public.clinic_profiles c on c.id = p.id
where p.role = 'clinic' and c.id is null;

insert into audit_findings(severity, check_name, entity_id, details)
select
  'warning',
  'role_mismatch_has_vet_row',
  p.id::text,
  'Non-vet profile has row in vet_profiles'
from public.profiles p
join public.vet_profiles v on v.id = p.id
where p.role <> 'vet';

insert into audit_findings(severity, check_name, entity_id, details)
select
  'warning',
  'role_mismatch_has_clinic_row',
  p.id::text,
  'Non-clinic profile has row in clinic_profiles'
from public.profiles p
join public.clinic_profiles c on c.id = p.id
where p.role <> 'clinic';

insert into audit_findings(severity, check_name, entity_id, details)
select
  'warning',
  'multiple_verification_requests',
  vr.profile_id::text,
  'Count=' || count(*)::text
from public.verification_requests vr
group by vr.profile_id
having count(*) > 1;

-- 3) Conditional checks for new columns / richer flows

do $$
declare
  has_profiles_status boolean;
  has_profiles_is_public boolean;
  has_vr_submitted_at boolean;
  has_vet_card_url boolean;
  has_vet_photo_url boolean;
  has_vet_specialties boolean;
  has_vet_specialty_docs boolean;
  has_clinic_rut boolean;
  has_clinic_services boolean;
  has_clinic_service_docs boolean;
  has_clinic_compliance_docs boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='status'
  ) into has_profiles_status;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='is_public'
  ) into has_profiles_is_public;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='verification_requests' and column_name='submitted_at'
  ) into has_vr_submitted_at;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='vet_profiles' and column_name='professional_card_file_url'
  ) into has_vet_card_url;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='vet_profiles' and column_name='profile_photo_url'
  ) into has_vet_photo_url;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='vet_profiles' and column_name='specialties'
  ) into has_vet_specialties;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='vet_profiles' and column_name='specialty_documents'
  ) into has_vet_specialty_docs;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='clinic_profiles' and column_name='rut_file_url'
  ) into has_clinic_rut;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='clinic_profiles' and column_name='services'
  ) into has_clinic_services;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='clinic_profiles' and column_name='service_documents'
  ) into has_clinic_service_docs;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='clinic_profiles' and column_name='compliance_documents'
  ) into has_clinic_compliance_docs;

  if has_profiles_status and has_profiles_is_public then
    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select
        'warning',
        'public_profile_not_approved',
        id::text,
        'is_public=true but status <> approved'
      from public.profiles
      where coalesce(is_public,false) = true
        and coalesce(status::text,'') <> 'approved'
    $q$;
  end if;

  if has_profiles_status and has_vr_submitted_at then
    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      with latest as (
        select distinct on (profile_id)
          profile_id,
          status::text as vr_status,
          submitted_at
        from public.verification_requests
        order by profile_id, submitted_at desc nulls last
      )
      select
        'warning',
        'status_mismatch_latest_request',
        p.id::text,
        'profiles.status=' || coalesce(p.status::text,'null') || ', latest verification_requests.status=' || coalesce(l.vr_status,'null')
      from public.profiles p
      join latest l on l.profile_id = p.id
      where coalesce(p.status::text,'') <> coalesce(l.vr_status,'')
    $q$;
  end if;

  if has_vet_card_url then
    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select 'error','vet_missing_professional_card_file', v.id::text, 'professional_card_file_url is null/empty'
      from public.vet_profiles v
      join public.profiles p on p.id = v.id
      where p.role = 'vet' and coalesce(v.professional_card_file_url,'') = ''
    $q$;
  end if;

  if has_vet_photo_url then
    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select 'warning','vet_missing_profile_photo', v.id::text, 'profile_photo_url is null/empty'
      from public.vet_profiles v
      join public.profiles p on p.id = v.id
      where p.role = 'vet' and coalesce(v.profile_photo_url,'') = ''
    $q$;
  end if;

  if has_vet_specialties and has_vet_specialty_docs then
    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select
        'warning',
        'vet_specialty_docs_count_mismatch',
        v.id::text,
        'specialties=' || coalesce(array_length(v.specialties,1),0)::text || ', docs=' || coalesce(jsonb_array_length(v.specialty_documents),0)::text
      from public.vet_profiles v
      join public.profiles p on p.id = v.id
      where p.role='vet'
        and coalesce(array_length(v.specialties,1),0) <> coalesce(jsonb_array_length(v.specialty_documents),0)
    $q$;
  end if;

  if has_clinic_rut then
    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select 'error','clinic_missing_rut', c.id::text, 'rut_file_url is null/empty'
      from public.clinic_profiles c
      join public.profiles p on p.id = c.id
      where p.role='clinic' and coalesce(c.rut_file_url,'') = ''
    $q$;
  end if;

  if has_clinic_services and has_clinic_service_docs then
    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select
        'warning',
        'clinic_service_docs_count_mismatch',
        c.id::text,
        'services=' || coalesce(array_length(c.services,1),0)::text || ', docs=' || coalesce(jsonb_array_length(c.service_documents),0)::text
      from public.clinic_profiles c
      join public.profiles p on p.id = c.id
      where p.role='clinic'
        and coalesce(array_length(c.services,1),0) <> coalesce(jsonb_array_length(c.service_documents),0)
    $q$;
  end if;

  if has_clinic_compliance_docs then
    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select 'error','clinic_missing_compliance_doc_mercantile_registry', c.id::text, 'compliance_documents.mercantile_registry_url missing'
      from public.clinic_profiles c
      join public.profiles p on p.id = c.id
      where p.role='clinic'
        and coalesce(c.compliance_documents ->> 'mercantile_registry_url','') = ''
    $q$;

    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select 'error','clinic_missing_compliance_doc_ica_registry', c.id::text, 'compliance_documents.ica_registry_url missing'
      from public.clinic_profiles c
      join public.profiles p on p.id = c.id
      where p.role='clinic'
        and coalesce(c.compliance_documents ->> 'ica_registry_url','') = ''
    $q$;

    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select 'error','clinic_missing_compliance_doc_professional_card', c.id::text, 'compliance_documents.professional_card_url missing'
      from public.clinic_profiles c
      join public.profiles p on p.id = c.id
      where p.role='clinic'
        and coalesce(c.compliance_documents ->> 'professional_card_url','') = ''
    $q$;

    execute $q$
      insert into audit_findings(severity, check_name, entity_id, details)
      select 'error','clinic_missing_compliance_doc_undergraduate_diploma', c.id::text, 'compliance_documents.undergraduate_diploma_url missing'
      from public.clinic_profiles c
      join public.profiles p on p.id = c.id
      where p.role='clinic'
        and coalesce(c.compliance_documents ->> 'undergraduate_diploma_url','') = ''
    $q$;
  end if;
end
$$;

-- 4) Output (first the severe findings)
select *
from audit_findings
order by
  case severity when 'error' then 1 when 'warning' then 2 else 3 end,
  check_name,
  entity_id;

-- 5) Summary
select severity, count(*) as findings
from audit_findings
group by severity
order by case severity when 'error' then 1 when 'warning' then 2 else 3 end;

rollback;
