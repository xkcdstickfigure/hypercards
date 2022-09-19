import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Page } from "../components/Page.tsx";
import { HCard } from "../components/HCard.tsx";
import ActivateForm from "../islands/ActivateForm.tsx";

export const handler = async (
  _req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  console.log(ctx.params.id);
  if (true) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "https://example.com",
      },
    });
  } else {
    return await ctx.render();
  }
};

export default (props: PageProps) => (
  <Page title="Activate Hypercard">
    <HCard>1024</HCard>
    <ActivateForm />
  </Page>
);
