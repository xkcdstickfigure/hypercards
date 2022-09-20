import { createRef, JSX } from "preact";
import { useState } from "preact/hooks";
import { platforms } from "../platforms.ts";

export default (
  { id, phone }: { id: string; phone: string },
) => {
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const valueRef = createRef();

  const submit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value: string = (valueRef.current?.value || "").trim();

    // validation
    if (platforms[platform].value && !value) {
      return setError("A value is required");
    }

    // request
    fetch(`/${id}/do-edit`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        platform,
        value,
      }),
    }).then((res) => {
      if (res.status === 200) {
        location.href = "/";
      } else {
        setError("Something went wrong");
      }
    }).catch(() => setError("Failed to connect to server"));
  };

  return (
    <form class="mt-4 space-y-4" onSubmit={submit}>
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
        <Field label={platforms[platform].value || ""}>
          <input
            ref={valueRef}
            placeholder={platforms[platform].placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            class="w-full h-12 border(2 gray-200) rounded-lg px-2"
          />
        </Field>
      )}

      <Field label="Phone">
        <div class="w-full h-12 border(2 gray-200) rounded-lg flex">
          <input
            disabled
            value={`+${phone}`}
            class="flex-grow px-2 text-gray-600"
          />
        </div>
      </Field>

      <button
        class="w-full h-12 text-white rounded-lg"
        style="background-color: #6234ef"
      >
        Update
      </button>

      {error && (
        <div class="w-full text-red-500 bg-red-100 border(2 red-200) rounded-lg p-2">
          {error}
        </div>
      )}
    </form>
  );
};

const Field = ({ label, children }: {
  label: string;
  children: JSX.Element;
}) => (
  <div>
    <p class="text-gray-800 font-semibold text-sm mb-0.5">{label}</p>
    {children}
  </div>
);
