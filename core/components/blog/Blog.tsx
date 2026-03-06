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
      'bg-gradient-to-br from-violet-500 to-purple-600',
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-pink-500 to-rose-600',
      'bg-gradient-to-br from-green-500 to-emerald-600',
      'bg-gradient-to-br from-orange-500 to-amber-600',
      'bg-gradient-to-br from-cyan-500 to-teal-600',
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
      return <div className="text-slate-600">{blog.content}</div>;
    }
  };

  const renderNode = (node: any): React.ReactNode => {
    if (!node) return null;

    switch (node.type) {
      case 'paragraph':
        return (
          <p className="mb-4 text-lg leading-relaxed text-gray-800">
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`p-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </p>
        );
      
      case 'heading':
        const headingTag = node.tag || 'h2';
        const headingClasses: Record<string, string> = {
          h1: 'text-4xl font-bold mb-6 mt-8 text-gray-900',
          h2: 'text-3xl font-bold mb-4 mt-6 text-gray-900',
          h3: 'text-2xl font-semibold mb-3 mt-5 text-gray-900',
        };
        const headingClass = headingClasses[headingTag] || headingClasses.h2;
        if (headingTag === 'h1') {
          return (
            <h1 className={headingClass}>
              {node.children?.map((child: any, i: number) => (
                <React.Fragment key={`h1-${i}`}>{renderNode(child)}</React.Fragment>
              ))}
            </h1>
          );
        } else if (headingTag === 'h3') {
          return (
            <h3 className={headingClass}>
              {node.children?.map((child: any, i: number) => (
                <React.Fragment key={`h3-${i}`}>{renderNode(child)}</React.Fragment>
              ))}
            </h3>
          );
        }
        return (
          <h2 className={headingClass}>
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`h2-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </h2>
        );
      
      case 'quote':
        return (
          <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-600 text-lg">
            {node.children?.map((child: any, i: number) => (
              <React.Fragment key={`quote-${i}`}>{renderNode(child)}</React.Fragment>
            ))}
          </blockquote>
        );
      
      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul';
        const listClass = node.listType === 'number' ? 'list-decimal ml-6 mb-4' : 'list-disc ml-6 mb-4';
        return (
          <ListTag className={listClass}>
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
          <a href={node.url} className="text-purple-600 underline hover:text-purple-800" target="_blank" rel="noopener noreferrer">
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
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
          
          <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-4 text-slate-600">
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
            <div className={`w-full h-full flex items-center justify-center ${getColorFromTitle(blog.title)}`}>
              <span className="text-9xl font-black text-white">
                {blog.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 pb-20">
        {renderContent()}
      </article>
    </div>
  )
}

export default Blog