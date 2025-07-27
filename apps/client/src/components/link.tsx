import { createLink, type LinkComponent } from '@tanstack/react-router';
import { type AnchorHTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

const BasicLinkComponent = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => {
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
});

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />;
};
