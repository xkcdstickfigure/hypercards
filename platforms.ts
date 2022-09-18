interface Platform {
  name: string;
  value?: string;
  placeholder?: string;
}

export const platforms: { [key: string]: Platform } = {
  instagram: {
    name: "Instagram",
    value: "Username",
  },
  discord: {
    name: "Discord Server",
    value: "Invite Code",
    placeholder: "J6P3nDQ8sT",
  },
  snapchat: {
    name: "Snapchat",
    value: "Username",
  },
  bereal: {
    name: "BeReal",
    value: "Username",
  },
  twitter: {
    name: "Twitter",
    value: "Username",
  },
  whatsapp: {
    name: "WhatsApp",
  },
  telegram: {
    name: "Telegram",
    value: "Username",
  },
  url: {
    name: "Custom URL",
    value: "Link",
    placeholder: "https://youtu.be/dQw4w9WgXcQ",
  },
};
