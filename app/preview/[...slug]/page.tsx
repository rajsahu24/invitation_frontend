interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params;
  const templateBaseUrl = process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL || 'http://localhost:2000';
  const previewUrl = `${templateBaseUrl}/preview/${slug.join('/')}`;

  // Debug logging for production issues
  console.log('[PreviewPage] URL Construction:', {
    templateBaseUrl,
    previewUrl,
    slug,
    env: process.env.NODE_ENV
  });

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src={previewUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Template Preview"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
