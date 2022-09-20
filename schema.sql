create table card (
    id             text         primary key,
    code           text         not null,
    activated_at   timestamp,
    platform       text,
    value          text,
    phone          text,
    pin            text
    partner        text,
    owner          text,
    price          int
);

create table client (
    id           uuid   primary key,
    token        text   unique not null,
    address      text   not null,
    user_agent   text
);

create table card_client (
    card_id       text         references card on delete cascade not null,
    client_id     uuid         references client on delete cascade not null,
    unlocked_at   timestamp,
    first_use     timestamp    not null,
    last_use      timestamp    not null,
    primary key (card_id, client_id)
);