import { createRef, JSX } from "preact";
import { useState } from "preact/hooks";
import { platforms } from "../platforms.ts";

export default ({ id }: JSX.HTMLAttributes) => {
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const valueRef = createRef();
  const phoneRef = createRef();
  const pinRef = createRef();

  const submit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value: string = (valueRef.current?.value || "").trim();
    const phone: string = (phoneRef.current?.value || "")
      .replace(/[^0-9]/g, "");
    const pin: string = pinRef?.current.value || "";

    // validation
    if (platforms[platform].value && !value) {
      return setError("A value is required");
    }
    if (!phone) return setError("A phone number is required");
    if (phone.length < 7 || phone.length > 10) {
      return setError("Phone number must be 7 to 10 digits");
    }
    if (!pin) return setError("A pin is required");
    if (!/^[0-9]{6}$/.test(pin)) {
      return setError("Pin must only contain numbers");
    }
    if (pin.length !== 6) return setError("Pin must be 6 digits");

    // request
    fetch(`/${id}/activate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        platform,
        value,
        phone,
        pin,
      }),
    }).then((res) => {
      if (res.status === 200) {
        location.href = "/activated";
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
        <Field label={platforms[platform].value}>
          <input
            ref={valueRef}
            placeholder={platforms[platform].placeholder}
            class="w-full h-12 border(2 gray-200) rounded-lg px-2"
          />
        </Field>
      )}

      <Field
        label="Phone"
        note="This will be used to help you if you get locked out"
      >
        <div class="w-full h-12 border(2 gray-200) rounded-lg flex">
          <div class="flex flex-col justify-center text-gray-600 border-r-2 px-2">
            +44
          </div>
          <input ref={phoneRef} type="tel" class="flex-grow px-2" />
        </div>
      </Field>

      <Field
        label="Pin (6 Digits)"
        note="You'll need this to change what the card does"
      >
        <input
          ref={pinRef}
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

      {error && (
        <div class="w-full text-red-500 bg-red-100 border(2 red-200) rounded-lg p-2">
          {error}
        </div>
      )}
    </form>
  );
};

const Field = ({ label, children, note }: {
  label: string;
  children: JSX.Element;
  note?: string;
}) => (
  <div>
    <p class="text-gray-800 font-semibold text-sm mb-0.5">{label}</p>
    {children}
    {note && <p class="text-xs text-gray-600 mt-0.5">{note}</p>}
  </div>
);
