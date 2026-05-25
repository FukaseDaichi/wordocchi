import type { MetadataRoute } from "next";

import { basePath, withBasePath } from "@/lib/base-path";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    start_url: withBasePath("/"),
    scope: basePath ? `${basePath}/` : "/",
    display: "standalone",
    background_color: "#FFF8E7",
    theme_color: "#FFF8E7",
    icons: [
      {
        src: withBasePath("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
