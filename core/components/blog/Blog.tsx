import type { Blog } from '@/core/dataModels/BlogDataModel'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Blogprops {
  blog: Blog
}

function Blog({ blog }: Blogprops) {
  const getColorFromTitle = (title: string) => {
    const colors = [
      { from: '#4A7C59', to: '#3a6347' },
      { from: '#7BAE7F', to: '#4A7C59' },
      { from: '#E07B5A', to: '#c4674a' },
      { from: '#4A7C59', to: '#7BAE7F' },
      { from: '#4A7C59', to: '#2d4a36' },
      { from: '#7BAE7F', to: '#5a9a5f' },
    ];
    const index = title.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderContent = () => {
    if (!blog.content) return null;
    
    try {
      const content = typeof blog.content === 'string' ? JSON.parse(blog.content) : blog.content;
      
      // Render Lexical content
      return (
        <div className="prose prose-lg max-w-none">
          {content.root?.children?.map((node: any, index: number) => (
            <div key={index}>{renderNode(node)}</div>
          ))}
        </div>
      );
    } catch (error) {
      return <div style={{ color: 'var(--color-text-body)' }}>{blog.content}</div>;
    }
  };

  const renderNode = (node: any): React.ReactNode => {
    if (!node) return null;

    switch (node.type) {
      case 'paragraph':
        return (
          <p className="mb-4 text-lg leading-relaxed"
            style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}
          >
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`p-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </p>
        );
      
      case 'heading':
        const headingTag = node.tag || 'h2';
        const headingClasses: Record<string, string> = {
          h1: 'text-4xl font-bold mb-6 mt-8',
          h2: 'text-3xl font-bold mb-4 mt-6',
          h3: 'text-2xl font-semibold mb-3 mt-5',
        };
        const headingStyle: Record<string, React.CSSProperties> = {
          h1: { color: 'var(--color-text-heading)', fontFamily: 'var(--font-display)' },
          h2: { color: 'var(--color-text-heading)', fontFamily: 'var(--font-display)' },
          h3: { color: 'var(--color-text-heading)', fontFamily: 'var(--font-display)' },
        };
        const headingClass = headingClasses[headingTag] || headingClasses.h2;
        const headingStyleObj = headingStyle[headingTag] || headingStyle.h2;
        if (headingTag === 'h1') {
          return (
            <h1 className={headingClass} style={headingStyleObj}>
              {node.children?.map((child: any, i: number) => (
                <React.Fragment key={`h1-${i}`}>{renderNode(child)}</React.Fragment>
              ))}
            </h1>
          );
        } else if (headingTag === 'h3') {
          return (
            <h3 className={headingClass} style={headingStyleObj}>
              {node.children?.map((child: any, i: number) => (
                <React.Fragment key={`h3-${i}`}>{renderNode(child)}</React.Fragment>
              ))}
            </h3>
          );
        }
        return (
          <h2 className={headingClass} style={headingStyleObj}>
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`h2-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </h2>
        );
      
      case 'quote':
        return (
          <blockquote 
            className="border-l-4 pl-4 my-4 italic text-lg"
            style={{ borderColor: 'var(--color-accent-primary)', color: 'var(--color-text-body)' }}
          >
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`quote-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </blockquote>
        );
      
      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul';
        const listClass = node.listType === 'number' ? 'list-decimal ml-6 mb-4' : 'list-disc ml-6 mb-4';
        return (
          <ListTag className={listClass} style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`list-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </ListTag>
        );
      
      case 'listitem':
        return (
          <li className="mb-1">
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`li-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </li>
        );
      
      case 'code':
        return (
          <pre className="bg-gray-100 rounded p-4 my-4 overflow-x-auto">
            <code className="font-mono text-sm">
              {node.children?.map((child: any, i: number) => (
                <React.Fragment key={`code-${i}`}>{renderNode(child)}</React.Fragment>
              ))}
            </code>
          </pre>
        );
      
      case 'link':
        return (
          <a 
            href={node.url} 
            className="underline hover:opacity-80 break-all"
            style={{ color: 'var(--color-accent-primary)', wordBreak: 'break-word', overflowWrap: 'anywhere' }} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`link-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </a>
        );
      
      case 'image':
        return (
          <div className="my-6">
            <img 
              src={node.src} 
              alt={node.altText || ''} 
              className="rounded-lg w-full"
              style={{ maxWidth: node.width ? `${node.width}px` : '100%' }}
            />
          </div>
        );
      
      case 'text':
        let textContent = node.text;
        let className = '';
        
        if (node.format) {
          if (node.format & 1) className += ' font-bold';
          if (node.format & 2) className += ' italic';
          if (node.format & 8) className += ' underline';
          if (node.format & 4) className += ' line-through';
        }
        
        return <span className={className}>{textContent}</span>;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/blog" className="inline-flex items-center gap-2 mb-6 transition-colors hover:opacity-80"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: 'var(--font-body)' }}>Back to Blog</span>
          </Link>
          
          <h1 className="text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}
          >
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-4" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 mb-12">
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(to bottom right, ${getColorFromTitle(blog.title).from}, ${getColorFromTitle(blog.title).to})` }}
            >
              <span className="text-9xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {blog.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <article className="whitespace-pre-wrap max-w-4xl mx-auto px-6 pb-20 overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
        {renderContent()}
      </article>
    </div>
  )
}

export default Blog