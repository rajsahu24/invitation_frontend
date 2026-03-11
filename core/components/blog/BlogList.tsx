import { Blog } from '@/core/dataModels/BlogDataModel'
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface BlogProps {
  blogs: Blog[]
}

function BlogList({ blogs }: BlogProps) {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-16 pt-28 px-8" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-heading)' }}>
            Our <span style={{ color: 'var(--color-accent-primary)' }}>Blog</span>
          </h1>
          <p className="text-xl" style={{ color: 'var(--color-text-body)' }}>Insights, tips, and stories about digital invitations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
            >
              {/* Thumbnail or Letter */}
              <div className="relative h-48 overflow-hidden">
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(to bottom right, ${getColorFromTitle(blog.title).from}, ${getColorFromTitle(blog.title).to})` }}
                  >
                    <span className="text-6xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      {blog.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 group-hover:transition-colors line-clamp-2"
                  style={{ color: 'var(--color-text-heading)', fontFamily: 'var(--font-display)' }}
                >
                  {blog.title}
                </h2>
                
                {blog.meta_description && (
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--color-text-body)', fontFamily: 'var(--font-body)' }}>
                    {blog.meta_description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>No blogs published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList