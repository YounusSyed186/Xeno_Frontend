import React from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5">
        {items.map((item, index) => (
          <li key={item.to ?? item.label} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="size-3.5 text-muted-foreground/40 flex-shrink-0" />}
            {item.to ? (
              <Link
                to={item.to}
                className="font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};