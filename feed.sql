create sequence room_reservation_id_seq
    as integer;

alter sequence room_reservation_id_seq owner to postgres;

create table "user"
(
    id              text      not null
        primary key,
    name            text      not null,
    email           text      not null
        unique,
    "emailVerified" boolean   not null,
    image           text,
    "createdAt"     timestamp not null,
    "updatedAt"     timestamp not null,
    role            text,
    banned          boolean,
    "banReason"     text,
    "banExpires"    timestamp
);

alter table "user"
    owner to postgres;

create table session
(
    id               text      not null
        primary key,
    "expiresAt"      timestamp not null,
    token            text      not null
        unique,
    "createdAt"      timestamp not null,
    "updatedAt"      timestamp not null,
    "ipAddress"      text,
    "userAgent"      text,
    "userId"         text      not null
        references "user",
    "impersonatedBy" text
);

alter table session
    owner to postgres;

create table account
(
    id                      text      not null
        primary key,
    "accountId"             text      not null,
    "providerId"            text      not null,
    "userId"                text      not null
        references "user",
    "accessToken"           text,
    "refreshToken"          text,
    "idToken"               text,
    "accessTokenExpiresAt"  timestamp,
    "refreshTokenExpiresAt" timestamp,
    scope                   text,
    password                text,
    "createdAt"             timestamp not null,
    "updatedAt"             timestamp not null
);

alter table account
    owner to postgres;

create table verification
(
    id          text      not null
        primary key,
    identifier  text      not null,
    value       text      not null,
    "expiresAt" timestamp not null,
    "createdAt" timestamp,
    "updatedAt" timestamp
);

alter table verification
    owner to postgres;

create table navigation_main
(
    id         serial
        primary key,
    title      varchar(255)  not null,
    url        varchar(1024) not null,
    icon       varchar(255),
    is_active  boolean   default true,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
);

alter table navigation_main
    owner to postgres;

create table navigation_item
(
    id                 serial
        primary key,
    navigation_main_id integer       not null
        references navigation_main
            on delete cascade,
    title              varchar(255)  not null,
    url                varchar(1024) not null,
    created_at         timestamp default CURRENT_TIMESTAMP,
    updated_at         timestamp default CURRENT_TIMESTAMP
);

alter table navigation_item
    owner to postgres;

create table lookup
(
    id          bigserial
        primary key,
    category    varchar(100) not null,
    code        varchar(100) not null,
    value       varchar(255) not null,
    description text,
    sort_order  integer   default 0,
    is_active   boolean   default true,
    created_at  timestamp default CURRENT_TIMESTAMP,
    updated_at  timestamp default CURRENT_TIMESTAMP,
    constraint uq_lookup_category_code
        unique (category, code)
);

alter table lookup
    owner to postgres;

create table room
(
    id          serial
        primary key,
    name        varchar(255) not null
        unique,
    location    varchar(255),
    capacity    integer,
    description text,
    facilities  text,
    is_active   boolean   default true,
    created_by  text
        references "user",
    updated_by  text
        references "user",
    created_at  timestamp default CURRENT_TIMESTAMP,
    updated_at  timestamp default CURRENT_TIMESTAMP,
    slug        varchar(255)
        unique
);

alter table room
    owner to postgres;

create table room_reservation
(
    id               varchar(50)              not null
        primary key,
    room_id          integer                  not null
        references room
            on delete cascade,
    user_id          text                     not null
        references "user",
    title            varchar(255)             not null,
    description      text,
    start_time       timestamp with time zone not null,
    end_time         timestamp with time zone not null,
    status_id        bigint                   not null
        references lookup,
    approver_id      text
        references "user",
    approved_at      timestamp with time zone,
    rejection_reason text,
    created_at       timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at       timestamp with time zone default CURRENT_TIMESTAMP,
    is_active        boolean                  default true
);

alter table room_reservation
    owner to postgres;

alter sequence room_reservation_id_seq owned by room_reservation.id;

create unique index unique_room_time
    on room_reservation (room_id, start_time, end_time)
    where (status_id = 3);

create table room_image
(
    id         serial
        primary key,
    room_id    integer not null
        references room
            on delete cascade,
    image_url  text    not null,
    is_cover   boolean   default false,
    sort_order integer   default 0,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    is_active  boolean   default true
);

alter table room_image
    owner to postgres;

create table notification
(
    id           serial
        primary key,
    recipient_id text,
    title        varchar(255) not null,
    message      text         not null,
    is_read      boolean                  default false,
    type         varchar(50),
    link         varchar(1024),
    created_at   timestamp with time zone default CURRENT_TIMESTAMP
);

alter table notification
    owner to postgres;

create view vw_available_facilities(facility) as
WITH facilities_split AS (SELECT TRIM(BOTH FROM facility.facility) AS facility
                          FROM room,
                               LATERAL UNNEST(STRING_TO_ARRAY(room.facilities, ','::text)) facility(facility))
SELECT DISTINCT facility
FROM facilities_split
WHERE facility IS NOT NULL
ORDER BY facility;

alter table vw_available_facilities
    owner to postgres;

create function generate_slug(text) returns text
    immutable
    language sql
as
$$
  select lower(
    regexp_replace(
      regexp_replace(trim($1), '[^\w\s]+', '', 'g'), -- Remove special characters
      '\s+', '-', 'g' -- Replace spaces with hyphens
    )
  );
$$;

alter function generate_slug(text) owner to postgres;

create function generate_random_string(integer) returns text
    language plpgsql
as
$$
declare
  chars text[] := '{a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9}';
  result text := '';
  i integer := 0;
begin
  for i in 1..$1 loop
    result := result || chars[ceil(random() * array_length(chars, 1))];
  end loop;
  return result;
end;
$$;

alter function generate_random_string(integer) owner to postgres;

create function set_room_slug() returns trigger
    language plpgsql
as
$$
declare
  base_slug text;
  random_suffix text;
begin
  base_slug := public.generate_slug(new.name);
  random_suffix := public.generate_random_string(8); -- generate 8 chars
  new.slug := base_slug || '-' || random_suffix;
  return new;
end;
$$;

alter function set_room_slug() owner to postgres;

create trigger set_room_slug_before_insert
    before insert
    on room
    for each row
execute procedure set_room_slug();

create trigger set_room_slug_before_update
    before update
    on room
    for each row
    when (new.name::text IS DISTINCT FROM old.name::text)
execute procedure set_room_slug();

create function generate_reservation_id() returns trigger
    language plpgsql
as
$$
DECLARE
    ts_millis text;
BEGIN
    ts_millis := (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::bigint::text;
    NEW.id := 'CAP-RES' || ts_millis;
    RETURN NEW;
END;
$$;

alter function generate_reservation_id() owner to postgres;

create trigger set_reservation_id
    before insert
    on room_reservation
    for each row
    when (new.id IS NULL)
execute procedure generate_reservation_id();

