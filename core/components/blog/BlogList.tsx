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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-16 pt-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Blog</span>
          </h1>
          <p className="text-xl text-slate-600">Insights, tips, and stories about digital invitations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
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
                  <div className={`w-full h-full flex items-center justify-center ${getColorFromTitle(blog.title)}`}>
                    <span className="text-6xl font-black text-white">
                      {blog.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                
                {blog.meta_description && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {blog.meta_description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500">
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
            <p className="text-slate-500 text-lg">No blogs published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList