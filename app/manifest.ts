import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Eterna Wholesale",
    short_name: "Eterna",
    description: "Premium bulk products with fast delivery across Kenya.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fff1f2",
    theme_color: "#be123c",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["shopping", "business"],
  };
}
