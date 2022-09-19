import { HandlerContext } from "$fresh/server.ts";
import { CardClientGet, CardGet, CardUse, ClientGet } from "../../database.ts";
import { getCookies } from "std/http/cookie.ts";

interface Body {
  pin?: string;
}

export const handler = async (
  req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  // parse body
  const body: Body = await req.json();
  if (typeof body.pin != "string") {
    return new Response(null, { status: 400 });
  }

  // card
  const card = await CardGet(ctx.params.id);
  if (!card) return new Response(null, { status: 400 });

  // client
  const token = getCookies(req.headers).hctoken;
  const client = await ClientGet(token);
  if (!client) {
    return new Response(null, { status: 400 });
  }

  // cardClient
  const cardClient = await CardClientGet(card.id, client.id);
  if (!cardClient) {
    return new Response(null, { status: 400 });
  }

  // check pin
  if (body.pin !== card.pin) {
    return new Response(null, { status: 400 });
  }

  // unlock
  await CardUse(card.id, client.id, true);

  // redirect
  return new Response();
};
