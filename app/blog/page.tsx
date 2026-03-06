import BlogList from "@/core/components/blog/BlogList";
import Footer from "@/core/components/landing/Footer";
import Navigation from "@/core/components/landing/Navigation";


async function page() {
    let blogs
  try {
    const BlogResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/blog`,
    );

    if (BlogResponse.ok) {
      blogs = await BlogResponse.json();
    } else {
      console.error("Failed to fetch Blog:", BlogResponse.status);
    }
  } catch (error) {
    console.error("Failed to fetch Blog:", error);
  }
  return(
    <>
    <nav/>
    {/* <Navigation  /> */}
      <BlogList blogs={blogs}/>
    {/* <Footer /> */}
    </>
  ) 
}

export default page;
