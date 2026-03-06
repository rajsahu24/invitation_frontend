import Blog from "@/core/components/blog/Blog";


interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

import type { Metadata } from 'next'
 
type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params }: Props,

): Promise<Metadata> {
  const slug = (await params).slug
  const post = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/blog/slug/${slug}`).then((res) =>
    res.json()
  )
  return {
    title: post.meta_title,
    description: post.meta_description,
  }
}
 

async function page({ params }: PageProps) {
  const { slug } = await params;
    let blog
  try {
    const BlogResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/blog/slug/${slug}`,
    );

    if (BlogResponse.ok) {
      blog = await BlogResponse.json();
    } else {
      console.error("Failed to fetch Blog:", BlogResponse.status);
    }
  } catch (error) {
    console.error("Failed to fetch Blog:", error);
  }
  return <><Blog blog={blog} /></>;
}

export default page;
