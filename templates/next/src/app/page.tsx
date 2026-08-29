import { redirect } from "next/navigation";

import BlogIndexPage from "./blog/page";
import { blogPath, getDeployMode } from "@/config/site";

export default function Home() {
  if (getDeployMode() === "subdomain") {
    return <BlogIndexPage />;
  }

  redirect(blogPath());
}
