import { JSX } from "preact";
import { useState } from "preact/hooks";
import { platforms } from "../platforms.ts";

export default () => {
  const [platform, setPlatform] = useState("instagram");

  return (
    <form class="mt-4 space-y-4">
      <Field label="Platform">
        <select
          value={platform}
          onChange={(e) => setPlatform((e.target as HTMLSelectElement).value)}
          class="w-full h-12 bg-white border(2 gray-200) rounded-lg px-2"
        >
          {Object.keys(platforms).map((p) => (
            <option value={p}>{platforms[p].name}</option>
          ))}
        </select>
      </Field>

      {platforms[platform].value && (
        <Field label={platforms[platform].value}>
          <input
            placeholder={platforms[platform].placeholder}
            class="w-full h-12 border(2 gray-200) rounded-lg px-2"
          />
        </Field>
      )}

      <Field label="Phone">
        <div class="w-full h-12 border(2 gray-200) rounded-lg flex">
          <div class="flex flex-col justify-center text-gray-600 border-r-2 px-2">
            +44
          </div>
          <input type="tel" class="flex-grow px-2" />
        </div>
      </Field>

      <Field label="Pin (6 Digits)">
        <input
          placeholder="••••••"
          maxLength={6}
          class="w-full h-12 border(2 gray-200) rounded-lg px-2 tracking-widest"
        />
      </Field>

      <button
        class="w-full h-12 text-white rounded-lg"
        style="background-color: #6234ef"
      >
        Activate
      </button>
    </form>
  );
};

const Field = ({ label, children }: JSX.HTMLAttributes) => (
  <div>
    <p class="text-gray-800 font-semibold text-sm">{label}</p>
    {children}
  </div>
);
