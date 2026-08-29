import type { Metadata } from "next";



import { BlogIndex, BlogShell } from "@openblog/components";



import { absoluteUrl, blogPath, site } from "@/config/site";

import { getBlogIndexData } from "@/lib/posts";



export const metadata: Metadata = {

  title: "Blog",

  description: site.description,

  alternates: {

    canonical: absoluteUrl(blogPath()),

  },

  openGraph: {

    title: `Blog | ${site.name}`,

    description: site.description,

    url: absoluteUrl(blogPath()),

    siteName: site.name,

    type: "website",

  },

};



export default function BlogIndexPage() {

  const data = getBlogIndexData();



  return (

    <BlogShell className="py-10 lg:py-14">

      <BlogIndex data={data} />

    </BlogShell>

  );

}

