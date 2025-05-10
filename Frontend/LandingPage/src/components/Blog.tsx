import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: 'The Future of Service Industry',
      excerpt: 'Discover how technology is transforming the service industry landscape.',
      author: 'Sarah Johnson',
      date: 'March 15, 2024',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80'
    },
    {
      title: 'Top Home Maintenance Tips',
      excerpt: 'Essential tips to keep your home in perfect condition all year round.',
      author: 'Mike Anderson',
      date: 'March 12, 2024',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80'
    },
    {
      title: 'Choosing the Right Service Provider',
      excerpt: 'Key factors to consider when selecting professional service providers.',
      author: 'Emily Chen',
      date: 'March 10, 2024',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80'
    }
  ];

  return (
    // Removed background gradient, using theme's bg-background
    <div id="blog" className="py-20 px-4 sm:px-6 lg:px-8"> 
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Section text made theme aware */}
          <h2 className="text-4xl font-bold text-foreground">Latest Updates</h2>
          <p className="mt-4 text-xl text-muted-foreground">Stay informed with our latest news and insights</p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            // Added animation and hover transform
            <div 
              key={index} 
              className="bg-card rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 border border-border/10 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }} // Staggered delay
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                {/* Meta text made theme aware */}
                <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </div>
                </div>
                {/* Post text made theme aware */}
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                {/* Button text made theme aware */}
                <button className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
                  Read more
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
