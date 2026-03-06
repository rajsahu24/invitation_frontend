import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  let blog = null;
  
  try {
    const BlogResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/blog/slug/${slug}`,
      { cache: 'no-store' }
    );

    if (BlogResponse.ok) {
      blog = await BlogResponse.json();
    }
  } catch (error) {
    console.error("Failed to fetch Blog:", error);
  }

  // Fallback if blog not found
  if (!blog) {
    return new ImageResponse(
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        Blog Not Found
      </div>,
      { ...size }
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: blog.thumbnail 
          ? `url(${blog.thumbnail})` 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
        }}
      />
      
      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '1000px',
          }}
        >
          {blog.title}
        </div>
        
        {blog.meta_description && (
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              marginTop: 30,
              maxWidth: '900px',
            }}
          >
            {blog.meta_description.substring(0, 150)}
          </div>
        )}
      </div>
    </div>,
    { ...size }
  );
}
