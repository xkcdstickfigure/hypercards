import { Card } from "./database.ts";

interface Platform {
  name: string;
  value?: string;
  placeholder?: string;
  url: (card: Card) => string;
}

export const platforms: { [key: string]: Platform } = {
  instagram: {
    name: "Instagram",
    value: "Username",
    url: ({ value }) =>
      `https://instagram.com/${encodeURIComponent(value || "")}`,
  },
  discord: {
    name: "Discord Server",
    value: "Invite Code",
    placeholder: "J6P3nDQ8sT",
    url: ({ value }) => `https://discord.gg/${encodeURIComponent(value || "")}`,
  },
  snapchat: {
    name: "Snapchat",
    value: "Username",
    url: ({ value }) =>
      `https://snapchat.com/add/${encodeURIComponent(value || "")}`,
  },
  bereal: {
    name: "BeReal",
    value: "Username",
    url: ({ value }) => `https://bere.al/${encodeURIComponent(value || "")}`,
  },
  twitter: {
    name: "Twitter",
    value: "Username",
    url: ({ value }) =>
      `https://twitter.com/${encodeURIComponent(value || "")}`,
  },
  whatsapp: {
    name: "WhatsApp",
    url: ({ phone }) => `https://wa.me/${encodeURIComponent(phone || "")}`,
  },
  telegram: {
    name: "Telegram",
    value: "Username",
    url: ({ value }) => `https://t.me/${encodeURIComponent(value || "")}`,
  },
  url: {
    name: "Custom URL",
    value: "Link",
    placeholder: "https://youtu.be/dQw4w9WgXcQ",
    url: ({ value }) => value || "",
  },
};
