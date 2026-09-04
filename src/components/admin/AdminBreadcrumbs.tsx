import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronRight, Home } from 'lucide-react';

export const AdminBreadcrumbs: React.FC = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Split path parts e.g. /admin/products/12/edit -> ['admin', 'products', '12', 'edit']
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0 || segments[0] !== 'admin') {
    return null;
  }

  // Construct breadcrumb items
  const items: { label: string; href: string }[] = [];
  let currentPath = '';

  segments.forEach((seg, index) => {
    currentPath += `/${seg}`;
    if (index === 0) {
      items.push({ label: 'Admin Console', href: '/admin/dashboard' });
    } else if (seg !== 'dashboard' || index !== 1) {
      const formatted = seg.replace(/-/g, ' ');
      items.push({
        label: formatted.charAt(0).toUpperCase() + formatted.slice(1),
        href: currentPath,
      });
    } else if (seg === 'dashboard' && index === 1) {
      items.push({
        label: 'Dashboard',
        href: '/admin/dashboard',
      });
      // Filter out duplicate root Admin item if Dashboard is explicit
      if (items.length > 1 && items[0]?.href === '/admin/dashboard') {
        items.shift();
      }
    }
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-muted-foreground">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link to="/admin/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="size-3.5" />
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.href}-${idx}`} className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-muted-foreground/40" />
              {isLast ? (
                <span className="font-semibold text-foreground capitalize">{item.label}</span>
              ) : (
                <Link to={item.href as any} className="hover:text-foreground transition-colors capitalize">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
