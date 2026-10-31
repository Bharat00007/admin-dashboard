import React from 'react';

interface PageHeaderProps {
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  subcategory,
  title,
  description,
  actions
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
            {category}
          </span>
          {subcategory && (
            <>
              <span className="text-outline-variant text-[10px]">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                {subcategory}
              </span>
            </>
          )}
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
          {title}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
          {description}
        </p>
      </div>

      {actions && (
        <div className="flex items-center gap-3 self-start md:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

