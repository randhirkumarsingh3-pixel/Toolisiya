import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet';

const BreadcrumbNavigation = ({ customTitle }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const generateSchema = () => {
    const itemListElement = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://toolisiya.com/"
      }
    ];

    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      itemListElement.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": index === pathnames.length - 1 && customTitle ? customTitle : name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
        "item": `https://toolisiya.com${currentPath}`
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElement
    };
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(generateSchema())}
        </script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="mb-6 w-full overflow-hidden">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap overflow-x-auto no-scrollbar py-1">
          <li className="flex items-center">
            <Link to="/" className="inline-flex items-center hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = isLast && customTitle ? customTitle : name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

            return (
              <li key={name} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 opacity-40 shrink-0" />
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {displayName}
                  </span>
                ) : (
                  <Link to={routeTo} className="hover:text-primary transition-colors">
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default BreadcrumbNavigation;