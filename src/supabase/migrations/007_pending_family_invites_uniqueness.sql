-- ============================================================
-- Prevent duplicate pending family invites for the same email
-- ============================================================

with ranked_pending_invites as (
  select
    id,
    row_number() over (
      partition by lower(invited_email)
      order by created_at desc, id desc
    ) as invite_rank
  from public.family_invites
  where status = 'pending'
)
update public.family_invites fi
set status = 'expired'
from ranked_pending_invites rpi
where fi.id = rpi.id
  and rpi.invite_rank > 1;

create unique index if not exists family_invites_one_pending_per_email_uq
  on public.family_invites (lower(invited_email))
  where status = 'pending';
