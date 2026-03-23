import { MetadataRoute } from "next"

const BASE_URL = "https://inviteera.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ✅ Always include the blog listing page as fallback
  const blogListingPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/blog`,
      { next: { revalidate: 3600 } }
    )

    // ✅ Check res.ok before calling .json()
    if (!res.ok) return blogListingPage

    const blogs = await res.json()

    // ✅ Check if it's actually an array
    if (!Array.isArray(blogs) || blogs.length === 0) return blogListingPage

    const blogUrls: MetadataRoute.Sitemap = blogs.map((item: any) => ({
      // ✅ Use slug directly — never transform it
      url: `${BASE_URL}/blog/${item.slug}`,
      lastModified: item.updated_at || item.created_at
        ? new Date(item.updated_at || item.created_at)
        : new Date(),
      changeFrequency: "monthly" as const, // ✅ monthly is more accurate for published posts
      priority: 0.7,  // ✅ lower than listing page (1.0) and homepage
    }))

    return [...blogListingPage, ...blogUrls]

  } catch (error) {
    console.error("Blog sitemap fetch failed:", error)
    // ✅ Always return at least the listing page on error
    return blogListingPage
  }
}