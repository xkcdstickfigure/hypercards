import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Page } from "../../components/Page.tsx";
import { HCard } from "../../components/HCard.tsx";
import EditForm from "../../islands/EditForm.tsx";
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
  if (
    !cardClient || !cardClient.unlocked_at ||
    new Date().getTime() - cardClient.unlocked_at.getTime() >=
      24 * 60 * 60 * 1000
  ) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/${card.id}/unlock` },
    });
  }

  // render
  return await ctx.render(card);
};

export default ({ data: card }: PageProps<Card>) => (
  <Page title="Edit Hypercard">
    <HCard>{card.code}</HCard>
    <EditForm id={card.id} phone={card.phone || ""} />
  </Page>
);
