import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Page } from "../components/Page.tsx";
import { HCard } from "../components/HCard.tsx";
import { Star } from "../components/Star.tsx";
import { Card, CardList, ClientGet } from "../database.ts";
import { getCookies } from "std/http/cookie.ts";

export const handler = async (
  req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const token = getCookies(req.headers).hctoken;
  const client = await ClientGet(token);
  const cards = client ? await CardList(client.id) : [];
  return await ctx.render(cards);
};

export default ({ data: cards }: PageProps<Card[]>) => (
  <Page title="hypercards">
    <p class="text-center">share with a tap!</p>
    <HCard>HYPR</HCard>

    {cards.length > 0 && (
      <div class="mt-8 space-y-4">
        {cards.map((c) => (
          <a
            href={`/${c.id}/edit`}
            class="block border(2 gray-200) rounded-lg px-4 py-2 text-gray-600 flex justify-between"
          >
            <span>{c.code}</span>
            {c.unlocked_at &&
              new Date().getTime() - c.unlocked_at.getTime() <
                24 * 60 * 60 * 1000 &&
              <Star />}
          </a>
        ))}
      </div>
    )}
  </Page>
);
