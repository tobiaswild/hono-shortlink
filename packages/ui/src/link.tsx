import { createLink, type LinkComponent } from '@tanstack/react-router';
import * as React from 'react';
import { cn } from './utils';

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        className={cn(
          'text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
          props.className,
        )}
      />
    );
  },
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />;
};
