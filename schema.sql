create table card (
    id             text         primary key,
    code           text         not null,
    activated_at   timestamp,
    platform       text,
    value          text,
    phone          text,
    pin            integer
);