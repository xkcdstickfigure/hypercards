import { HandlerContext, Handlers } from "$fresh/server.ts";
import {
  CardActivate,
  CardGet,
  CardUse,
  ClientCreate,
  ClientGet,
} from "../../database.ts";
import { platforms } from "../../platforms.ts";
import { getCookies } from "std/http/cookie.ts";

interface Body {
  platform?: string;
  value?: string;
  phone?: string;
  pin?: string;
}

export const handler: Handlers = {
  POST: async (
    req: Request,
    ctx: HandlerContext,
  ): Promise<Response> => {
    // parse body
    const body: Body = await req.json();
    if (
      typeof body.platform != "string" ||
      typeof body.phone != "string" ||
      typeof body.pin != "string" ||
      !Object.keys(platforms).includes(body.platform) ||
      !/^[0-9]{7,10}$/.test(body.phone) ||
      !/^[0-9]{6}$/.test(body.pin)
    ) return new Response(null, { status: 400 });

    // value
    let value: string | null = null;
    if (platforms[body.platform].value) {
      if (
        typeof body.value !== "string" || !body.value || body.value.length > 256
      ) return new Response(null, { status: 400 });
      value = body.value;
    }

    // get card
    const card = await CardGet(ctx.params.id);
    if (card && !card.activated_at) {
      // update
      await CardActivate(
        card.id,
        body.platform,
        value,
        "44" + body.phone,
        body.pin,
      );

      // client
      const token = getCookies(req.headers).hctoken;
      const address = (ctx.remoteAddr as Deno.NetAddr).hostname;
      let client = await ClientGet(token);
      if (!client) {
        client = await ClientCreate(
          address,
          req.headers.get("user-agent"),
        );
      }
      await CardUse(card.id, client.id, true);

      // set cookie
      const cookie = [`hctoken=${client.token}`];
      cookie.push(`Max-Age=${365 * 24 * 60 * 60}`);
      if (Deno.env.get("DENO_ENV") === "production") cookie.push("Secure");

      // response
      return new Response(null, {
        headers: {
          "set-cookie": cookie.join("; "),
        },
      });
    } else {
      return new Response(null, { status: 400 });
    }
  },
};
