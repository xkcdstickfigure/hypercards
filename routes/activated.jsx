import { Page } from "../components/Page.tsx";

export default () => (
  <Page title="Ready to go!">
    <p class="text-center">Your Hypercard is activated</p>

    <div class="w-60 h-36 mx-auto mt-12 border(2 gray-200) rounded-lg flex flex-col justify-center -rotate-12 relative">
      <div class="w-6 h-6 border(1 blue-500) rounded-full absolute -top-2 -right-2 animate-ping" />
      <span
        class="mx-auto text-3xl font-bold bg-clip-text text-transparent"
        style="background-image: linear-gradient(to top right, #3464ef, #6234ef, #d134e6, #ef348d, #ef6834);"
      >
        HYPR
      </span>
    </div>

    <p class="text-center text-sm text-gray-600 mt-8">
      Just tap it against a phone to do the magic
    </p>

    <div class="mx-8 my-6">
      <div class="w-full border(t-1 gray-200)" />
    </div>

    <p class="text-center">
      Go to{" "}
      <a href="/" class="font-semibold" style="color: #6234ef">hypr.cards</a>
      {" "}
      to edit your card
    </p>
  </Page>
);
