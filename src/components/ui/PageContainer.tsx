import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { PageHeader } from './PageHeader';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export interface PageContainerProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  headerChildren?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export const PageContainer: React.FC<PageContainerProps> = ({
  breadcrumbs,
  title,
  description,
  actions,
  headerChildren,
  children,
  className = '',
  maxWidth = '7xl',
}) => {
  return (
    <div className={`mx-auto w-full ${maxWidthMap[maxWidth]} px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      {(title || actions) && (
        <PageHeader
          title={title || ''}
          description={description}
          actions={actions}
        >
          {headerChildren}
        </PageHeader>
      )}

      {children}
    </div>
  );
};
