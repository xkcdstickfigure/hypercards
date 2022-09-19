import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";

export const client = new Client(Deno.env.get("DATABASE_URL"));
await client.connect();

export interface Card {
  id: string;
  code: string;
  activated_at?: Date;
  platform?: string;
  value?: string;
  phone?: string;
  pin?: string;
}

export const CardGet = async (id: string): Promise<Card | null> => {
  return (await client.queryObject<Card>(
    "select id, code, activated_at, platform, value, phone, pin from card where id=$1",
    [id],
  )).rows[0] || null;
};

export const CardActivate = async (
  id: string,
  platform: string,
  value: string | null,
  phone: string,
  pin: string,
) => {
  await client.queryObject(
    "update card set activated_at=now(), platform=$2, value=$3, phone=$4, pin=$5 where id=$1",
    [id, platform, value, phone, pin],
  );
};
