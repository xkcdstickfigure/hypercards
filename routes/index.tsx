import { Head } from "$fresh/runtime.ts";

export default () => {
  return (
    <>
      <Head>
        <title>hypercards</title>
      </Head>
      <div class="pt-16 px-4 mx-auto max-w-screen-md">
        <h1 class="text-4xl font-bold text-center">hypercards</h1>
        <p class="text-center">share with a tap!</p>

        <div class="mx-auto mt-4 max-w-full w-80 h-48 border(2 gray-200) rounded-lg flex flex-col justify-center">
          <span
            class="mx-auto text-6xl font-bold bg-clip-text text-transparent"
            style="background-image: linear-gradient(to top right, #3464ef, #6234ef, #d134e6, #ef348d, #ef6834);"
          >
            HYPR
          </span>
        </div>
      </div>
    </>
  );
};
