import React from 'react';

import { VscLinkExternal } from 'react-icons/vsc';

type ExternalLinkProps = {
  url: string;
  children: React.ReactNode;
  ariaLabel: string;
  icon?: boolean;
  className?: string;
};

export const ExternalLink = ({ url, children, ariaLabel, icon, className }: ExternalLinkProps) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={className}>
      {children}
      {icon ?? <VscLinkExternal className="ml-1 inline h-4 w-4 fill-current" />}
    </a>
  );
};
