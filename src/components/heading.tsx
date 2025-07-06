import { css, cx } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps extends PropsWithChildren {
  level?: HeadingLevel;
  class?: string;
  style?: string;
}

export default function Heading({
  children,
  level = 'h2',
  class: className,
  style,
}: HeadingProps) {
  // Use existing styles or create simple heading styles
  const headingClasses = {
    h1: css`
    color: #2563eb;
    margin-bottom: 10px;
  `,
    h2: css`
    color: #2563eb;
    margin-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 10px;
  `,
    h3: css`
    text-align: center;
    margin-bottom: 30px;
    color: #2563eb;
  `,
    h4: 'text-lg font-medium text-gray-700 mb-2',
    h5: 'text-base font-medium text-gray-600 mb-1',
    h6: 'text-sm font-medium text-gray-500 mb-1',
  };

  const classes = cx(headingClasses[level], className);

  const props = {
    class: classes,
    ...(style && { style }),
  };

  // Render the appropriate heading element based on level
  switch (level) {
    case 'h1':
      return <h1 {...props}>{children}</h1>;
    case 'h2':
      return <h2 {...props}>{children}</h2>;
    case 'h3':
      return <h3 {...props}>{children}</h3>;
    case 'h4':
      return <h4 {...props}>{children}</h4>;
    case 'h5':
      return <h5 {...props}>{children}</h5>;
    case 'h6':
      return <h6 {...props}>{children}</h6>;
    default:
      return <h2 {...props}>{children}</h2>;
  }
}
