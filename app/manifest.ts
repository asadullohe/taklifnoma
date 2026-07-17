import type { MetadataRoute } from "next";
import { title, description } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: title,
    short_name: "Taklifnoma",
    description,
    start_url: "/",
    display: "standalone",
    background_color: "#efe9db",
    theme_color: "#4a543d",
    lang: "uz",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
