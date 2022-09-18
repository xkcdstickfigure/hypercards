import { JSX } from "preact";
import { Head } from "$fresh/runtime.ts";

export const Page = ({ title, children }: JSX.HTMLAttributes) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <div class="pt-16 pb-8 px-4 mx-auto w-80">
      <h1 class="text-3xl font-bold text-center">{title}</h1>
      {children}
    </div>
  </>
);
