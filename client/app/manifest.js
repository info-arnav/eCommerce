export default function manifest() {
  return {
    name: process.env.BRAND,
    short_name: process.env.BRAND,
    description: process.env.ABOUT,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
