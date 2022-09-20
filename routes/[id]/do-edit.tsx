import { HandlerContext, Handlers } from "$fresh/server.ts";
import {
  CardClientGet,
  CardGet,
  CardUpdate,
  ClientGet,
} from "../../database.ts";
import { platforms } from "../../platforms.ts";

interface Body {
  token?: string;
  platform?: string;
  value?: string;
}

export const handler: Handlers = {
  POST: async (
    req: Request,
    ctx: HandlerContext,
  ): Promise<Response> => {
    // parse body
    const body: Body = await req.json();
    if (
      typeof body.token !== "string" ||
      typeof body.platform != "string" ||
      !Object.keys(platforms).includes(body.platform)
    ) return new Response(null, { status: 400 });

    // value
    let value: string | null = null;
    if (platforms[body.platform].value) {
      if (
        typeof body.value !== "string" ||
        !body.value ||
        body.value.length > 256
      ) return new Response(null, { status: 400 });
      value = body.value;
    }

    // card
    const card = await CardGet(ctx.params.id);
    if (!card) return new Response(null, { status: 400 });

    // client
    const client = await ClientGet(body.token);
    if (!client) {
      return new Response(null, { status: 400 });
    }

    // check card is unlocked
    const cardClient = await CardClientGet(card.id, client.id);
    if (
      !cardClient || !cardClient.unlocked_at ||
      new Date().getTime() - cardClient.unlocked_at.getTime() >=
        24 * 60 * 60 * 1000
    ) {
      return new Response(null, { status: 400 });
    }

    // update
    await CardUpdate(
      card.id,
      body.platform,
      value,
    );

    // response
    return new Response();
  },
};
