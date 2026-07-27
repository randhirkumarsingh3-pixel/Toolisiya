export const blogPosts = [
  {
    id: "image-compression-guide",
    slug: "image-compression-guide",
    title: "The Ultimate Guide to Image Compression: PNG vs JPG vs WebP",
    description: "Learn how image compression works, when to use different file formats, and how to optimize your web assets for peak performance.",
    category: "Tutorials",
    author: "Toolisiya Editorial",
    date: "May 20, 2026",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80",
    content: `
      Image compression is one of the most critical aspects of modern web development and digital asset management. A single unoptimized image can slow down your website page speed, directly hurting your SEO rankings and user retention. In this comprehensive guide, we will break down the differences between PNG, JPG, and WebP, and show you how to choose the right format for your project.

      ### PNG vs JPG vs WebP: Which Should You Use?

      1. **PNG (Portable Network Graphics)**: A lossless compression format. PNG is ideal for images with transparent backgrounds, text overlays, or graphics requiring pixel-perfect sharpness. However, file sizes tend to be very large.
      2. **JPG (Joint Photographic Experts Group)**: A lossy compression format. JPG is perfect for photographic images with lots of color detail. By discarding minor color details that the human eye cannot detect, it drastically reduces file sizes.
      3. **WebP**: A modern, next-generation format developed by Google. WebP supports both lossy and lossless compression. It offers 26% smaller file sizes compared to PNG, and 25-34% smaller sizes compared to JPG, without sacrificing quality.

      ### Pro Tips for Web Optimization
      - **Always use WebP for web assets**: Most modern browsers fully support WebP. Converting your JPG/PNG assets to WebP can improve your Lighthouse speed scores instantly.
      - **Scrub metadata**: Camera metadata (EXIF data) like location, camera model, and dates add unnecessary bytes. Use our metadata remover to strip this data before uploading to your site.
    `
  },
  {
    id: "pdf-management-hacks",
    slug: "pdf-management-hacks",
    title: "5 Essential PDF Hacks for Better Document Workflows",
    description: "Struggling with bloated PDF documents? Discover how merging, splitting, and compressing PDFs can improve your productivity.",
    category: "Productivity Tips",
    author: "Toolisiya Editorial",
    date: "May 22, 2026",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    content: `
      PDF (Portable Document Format) is the gold standard for sharing professional contracts, resumes, and invoices. However, editing and organizing PDFs can often feel painful without expensive software licenses. In this guide, we reveal five essential document hacks you can execute entirely in your browser using Toolisiya's secure client-side tools.

      ### 1. Compress PDFs Before Emailing
      Many email clients block attachments larger than 25MB. PDF Compressor reduces bloated vectors and images embedded in your document, dropping files to a fraction of their original size while maintaining text clarity.

      ### 2. Merge Separate Scans
      If you scan multiple contract pages using your phone, they often save as individual images. Use a Document Scanner to scan and organize them, then combine them into a single sequential PDF with our PDF Merger.

      ### 3. Extract Specific Pages
      Need to send only page 3 of a 50-page tax document? Don't send the entire file. Use the PDF Splitter to extract precisely the ranges you need (e.g. "3, 5, 8-12"), keeping your communication concise and secure.
    `
  }
];

export const getBlogPost = (slug) => {
  return blogPosts.find(post => post.slug === slug) || null;
};
