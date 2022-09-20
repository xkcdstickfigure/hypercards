import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Page } from "../../components/Page.tsx";
import UnlockForm from "../../islands/UnlockForm.tsx";
import { Card, CardClientGet, CardGet, ClientGet } from "../../database.ts";
import { getCookies } from "std/http/cookie.ts";

export const handler = async (
  req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  // card
  const card = await CardGet(ctx.params.id);
  if (!card) return new Response(null, { status: 404 });

  // client
  const token = getCookies(req.headers).hctoken;
  const client = await ClientGet(token);
  if (!client) {
    return new Response(null, { status: 302, headers: { Location: "/" } });
  }

  // cardClient
  const cardClient = await CardClientGet(card.id, client.id);
  if (!cardClient) {
    return new Response(null, { status: 302, headers: { Location: "/" } });
  }

  // render
  return await ctx.render(card);
};

export default ({ data: card }: PageProps<Card>) => (
  <Page title="Unlock Hypercard">
    <p class="text-center">Enter the pin for {card.code}</p>
    <UnlockForm id={card.id} />
  </Page>
);
