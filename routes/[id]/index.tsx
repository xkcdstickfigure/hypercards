import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Page } from "../../components/Page.tsx";
import { HCard } from "../../components/HCard.tsx";
import ActivateForm from "../../islands/ActivateForm.tsx";
import {
  Card,
  CardGet,
  CardUse,
  ClientCreate,
  ClientGet,
} from "../../database.ts";
import { platforms } from "../../platforms.ts";
import { getCookies } from "std/http/cookie.ts";

export const handler = async (
  req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const card = await CardGet(ctx.params.id);
  if (!card) {
    return new Response(null, { status: 404 });
  } else if (card.activated_at) {
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
    await CardUse(card.id, client.id, false);

    // set cookie
    const cookie = [`hctoken=${client.token}`];
    cookie.push(`Max-Age=${365 * 24 * 60 * 60}`);
    if (Deno.env.get("DENO_ENV") === "production") cookie.push("Secure");

    // generate url and redirect
    const url = platforms[card.platform || ""]?.url(card);
    return new Response(null, {
      status: 302,
      headers: {
        "location": url || "/",
        ...(token !== client.token
          ? {
            "set-cookie": cookie.join("; "),
          }
          : {}),
      },
    });
  } else {
    return await ctx.render(card);
  }
};

export default ({ data: card }: PageProps<Card>) => (
  <Page title="Activate Hypercard">
    <HCard>{card.code}</HCard>
    <ActivateForm id={card.id} />
  </Page>
);
