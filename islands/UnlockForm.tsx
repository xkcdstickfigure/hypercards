import { createRef, JSX } from "preact";

export default ({ id }: JSX.HTMLAttributes) => {
  const pinRef = createRef();

  const submit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pin: string = pinRef?.current.value || "";

    // request
    fetch(`/${id}/do-unlock`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ pin }),
    }).then((res) => {
      if (res.status === 200) {
        location.href = `/${id}/edit`;
      }
    });
  };

  return (
    <form class="mt-4 space-y-4" onSubmit={submit}>
      <input
        ref={pinRef}
        placeholder="••••••"
        maxLength={6}
        class="w-full h-12 border(2 gray-200) rounded-lg px-2 tracking-widest"
      />

      <button
        class="w-full h-12 text-white rounded-lg"
        style="background-color: #6234ef"
      >
        Activate
      </button>
    </form>
  );
};
