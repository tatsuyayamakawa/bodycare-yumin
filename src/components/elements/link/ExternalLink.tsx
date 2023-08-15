import { VscLinkExternal } from 'react-icons/vsc';

import type { ExternalLinkProps } from 'src/@types/global';

export const ExternalLink = ({ url, children, ariaLabel, icon, className }: ExternalLinkProps) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={className}>
      {children}
      {icon ?? <VscLinkExternal className="ml-1 inline h-4 w-4 fill-current" />}
    </a>
  );
};
