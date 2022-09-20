FROM denoland/deno:1.25.3
WORKDIR /app
COPY . .
CMD deno run -A main.ts