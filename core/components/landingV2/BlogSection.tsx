'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Calendar, User } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  meta_description?: string;
  thumbnail?: string;
  created_at: string;
}

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIGATEWAY_URL}/api/blog`);
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className={`py-16 md:py-24 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: 'var(--color-bg-section-alt)' }}
    >
      <div className="container-landing">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              backgroundColor: 'rgba(74, 124, 89, 0.1)',
              color: 'var(--color-accent-primary)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Our Blog
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-heading)',
            }}
          >
            Read Our{' '}
            <span style={{ color: 'var(--color-accent-primary)' }}>Latest Articles</span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-body)',
            }}
          >
            Tips, guides, and inspiration for creating perfect invitations and planning memorable events.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className="group cursor-pointer"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <Link href={`/blog/${post.slug}`}>
                {/* Image */}
                <div
                  className="relative rounded-[16px] overflow-hidden mb-4 aspect-[16/10]"
                  style={{ backgroundColor: 'var(--color-border)' }}
                >
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-6xl font-bold text-white"
                      style={{
                        background: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][post.title.charCodeAt(0) % 6],
                      }}
                    >
                      {post.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <h3
                    className="text-lg md:text-xl font-bold mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[var(--color-accent-primary)]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text-heading)',
                    }}
                  >
                    {post.title}
                  </h3>
                  {post.meta_description && (
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-body)',
                      }}
                    >
                      {post.meta_description}
                    </p>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar
                      className="w-3.5 h-3.5"
                      style={{ color: 'var(--color-text-muted)' }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[50px] text-sm font-semibold transition-all duration-200 hover:gap-3"
            style={{
              backgroundColor: 'var(--color-accent-primary)',
              color: 'white',
              fontFamily: 'var(--font-body)',
            }}
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
