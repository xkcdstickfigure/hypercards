import { JSX } from "preact";

export const HCard = ({ children }: JSX.HTMLAttributes) => (
  <div class="mt-4 h-48 border(2 gray-200) rounded-lg flex flex-col justify-center">
    <span
      class="mx-auto text-6xl font-bold bg-clip-text text-transparent"
      style="background-image: linear-gradient(to top right, #3464ef, #6234ef, #d134e6, #ef348d, #ef6834);"
    >
      {children}
    </span>
  </div>
);
