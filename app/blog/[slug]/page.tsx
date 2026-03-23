import { Metadata } from "next";
import { notFound } from "next/navigation";
import Blog from "@/core/components/blog/Blog";

const baseUrl = "https://inviteera.com";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getBlog(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/blog/slug/${slug}`,
      { next: { revalidate: 3600 } }   // cache for 1 hour
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) return { title: "Blog | InviteEra" };

  return {
    title: post.meta_title,
    description: post.meta_description,

    // ✅ Canonical URL — prevents duplicate content penalty
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },

    // ✅ Open Graph — controls WhatsApp/Facebook/LinkedIn previews
    openGraph: {
      title: post.meta_title,
      description: post.meta_description,
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      siteName: "InviteEra",
      images: (post.cover_image || post.thumbnail)
        ? [
            {
              url: post.cover_image || post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.meta_title,
            },
          ]
        : [],
    },

    // ✅ Twitter/X card
    twitter: {
      card: "summary_large_image",
      title: post.meta_title,
      description: post.meta_description,
      images: (post.cover_image || post.thumbnail) ? [post.cover_image || post.thumbnail] : [],
    },

    // ✅ Robots — tell Google to index this page
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

// ✅ JSON-LD Schema — helps Google show rich results
function BlogSchema({ post, slug }: { post: any; slug: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta_title,
    description: post.meta_description,
    image: post.cover_image || "",
    url: `${baseUrl}/blog/${slug}`,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Organization",
      name: "InviteEra",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "InviteEra",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ✅ Page component with notFound() handling
export default async function page({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  // ✅ Returns proper 404 if blog not found
  if (!blog) return notFound();

  return (
    <>
      <BlogSchema post={blog} slug={slug} />
      <Blog blog={blog} />
    </>
  );
}