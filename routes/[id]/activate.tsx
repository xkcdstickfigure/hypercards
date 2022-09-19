import { HandlerContext, Handlers } from "$fresh/server.ts";
import { CardActivate, CardGet } from "../../database.ts";
import { platforms } from "../../platforms.ts";

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
      return new Response();
    } else {
      return new Response(null, { status: 400 });
    }
  },
};
