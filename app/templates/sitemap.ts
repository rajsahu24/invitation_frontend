import { MetadataRoute } from "next"

const BASE_URL = "https://inviteera.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/templates`,
    { next: { revalidate: 3600 } }
  )

  const templates = await res.json()

  const templateUrls = templates.map((item: any) => {

    const template_name = item.template_name
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/\s+/g, "_")

    const template_type = item.template_type.toLowerCase()
      .replace(/&/g, "")
      .replace(/\s+/g, "_")

    return {
      url: `${BASE_URL}/preview/${template_type}/${template_name}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }
  })

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/templates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    ...templateUrls
  ]
}