import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://inviteera.com'

  let dynamicUrls: MetadataRoute.Sitemap = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/invitations`, {
      next: { revalidate: 3600 }
    })
    if (res.ok) {
        console.log(res)
      const invitations = await res.json()
      dynamicUrls = invitations.map((item: any) => ({
        url: `${baseUrl}/invitation/${item.id}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch invitations for sitemap:', error)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'weekly',
    },
    {
      url: `${baseUrl}/#templates`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: 'monthly',
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: 'monthly',
    },
    {
      url: `${baseUrl}/#how-it-works`,
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: 'monthly',
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: new Date(),
      priority: 0.5,
        changeFrequency: 'monthly',
    },

    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      priority: 0.5,
        changeFrequency: 'monthly',
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      priority: 0.2,
        changeFrequency:
        'yearly',
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      priority: 0.2,
      changeFrequency: 'yearly',
    },

    ...dynamicUrls,
  ]
}
