import { Client as Database } from "postgres/mod.ts";
import { cryptoRandomString } from "crypto-random-string/mod.ts";

const db = new Database(Deno.env.get("DATABASE_URL"));
await db.connect();

export interface Card {
  id: string;
  code: string;
  activated_at: Date | null;
  platform: string | null;
  value: string | null;
  phone: string | null;
  pin: string | null;
  unlocked_at?: Date | null;
}

export interface Client {
  id: string;
  token: string;
  address: string;
  user_agent: string | null;
}

export interface CardClient {
  card_id: string;
  client_id: string;
  unlocked_at: Date | null;
  first_use: Date;
  last_use: Date;
}

export const CardGet = async (id: string): Promise<Card | null> =>
  (await db.queryObject<Card>(
    "select id, code, activated_at, platform, value, phone, pin from card where id=$1",
    [id],
  )).rows[0] || null;

export const CardActivate = async (
  id: string,
  platform: string,
  value: string | null,
  phone: string,
  pin: string,
) => {
  await db.queryObject(
    "update card set activated_at=now(), platform=$2, value=$3, phone=$4, pin=$5 where id=$1",
    [id, platform, value, phone, pin],
  );
};

export const CardUpdate = async (
  id: string,
  platform: string,
  value: string | null,
) => {
  await db.queryObject(
    "update card set platform=$2, value=$3 where id=$1",
    [id, platform, value],
  );
};

export const ClientGet = async (token: string): Promise<Client | null> =>
  (await db.queryObject<Client>(
    "select id, token, address, user_agent from client where token=$1",
    [token],
  )).rows[0] || null;

export const ClientCreate = async (
  address: string,
  user_agent: string | null,
): Promise<Client> => {
  const id = crypto.randomUUID();
  const token = cryptoRandomString({ length: 32, type: "alphanumeric" });
  await db.queryObject(
    "insert into client (id, token, address, user_agent) values ($1, $2, $3, $4)",
    [id, token, address, user_agent],
  );
  return { id, token, address, user_agent };
};

export const CardUse = async (
  card_id: string,
  client_id: string,
  unlocked: boolean,
) => {
  await db.queryObject(
    `insert into card_client (card_id, client_id, unlocked_at, first_use, last_use) values ($1, $2, ${
      unlocked ? "now()" : "null"
    }, now(), now()) on conflict (card_id, client_id) do update set last_use=now()${
      unlocked ? ", unlocked_at=now()" : ""
    }`,
    [card_id, client_id],
  );
};

export const CardList = async (client_id: string): Promise<Card[]> =>
  (await db.queryObject<Card>(
    "select id, code, activated_at, platform, value, phone, pin, unlocked_at from card_client join card on card.id=card_id where client_id=$1 order by last_use desc",
    [client_id],
  )).rows;

export const CardClientGet = async (
  card_id: string,
  client_id: string,
): Promise<CardClient | null> =>
  (await db.queryObject<CardClient>(
    "select card_id, client_id, unlocked_at, first_use, last_use from card_client where card_id=$1 and client_id=$2",
    [card_id, client_id],
  )).rows[0] || null;
