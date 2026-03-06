import { MetadataRoute } from "next"

const BASE_URL = "https://inviteera.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/blog`,
    { next: { revalidate: 3600 } }
  )

  const blog = await res.json()

  const blogUrls = blog.map((item: any) => {

    const slug = item.slug
      .toLowerCase()
      .replace(/&/g, "&amp;")
      .replace(/\s+/g, "_")

    const lastModified = item.updated_at || item.created_at;

    return {
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }
  })

  return [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    ...blogUrls
  ]
}