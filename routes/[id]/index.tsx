import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Page } from "../../components/Page.tsx";
import { HCard } from "../../components/HCard.tsx";
import ActivateForm from "../../islands/ActivateForm.tsx";
import { Card, CardGet } from "../../database.ts";
import { platforms } from "../../platforms.ts";

export const handler = async (
  _req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const card = await CardGet(ctx.params.id);
  if (!card) {
    return new Response(null, { status: 404 });
  } else if (card.activated_at) {
    const url = platforms[card.platform || ""]?.url(card);
    return new Response(null, {
      status: 302,
      headers: {
        Location: url || "/",
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
