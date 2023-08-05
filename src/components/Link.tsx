import React from 'react';
import styles from './Link.module.css';
import { Link as LinkRouter, useRoute } from 'wouter';

import type { LinkProps as LinkRouterProps } from 'wouter';

type LinkProps = LinkRouterProps & {
  href: string;
  children: JSX.Element;
};

export const Link: React.FC<LinkProps> = ({
  className,
  style,
  children,
  ...props
}) => {
  return (
    <LinkRouter {...props}>
      <a className={`${className}`} style={style}>
        {children}
      </a>
    </LinkRouter>
  );
};

export const NavLink: React.FC<
  Omit<LinkProps, 'children'> & {
    children: JSX.Element | ((isActive: boolean) => JSX.Element);
  }
> = ({ className, style, children, ...props }) => {
  const [isActive] = useRoute(props.href);

  return (
    <LinkRouter {...props}>
      <a
        className={`${styles.navlink} ${className}`}
        style={{
          ...(isActive
            ? { color: 'var(--sc-purple)', fontWeight: 'bold' }
            : undefined),
          ...style,
        }}
      >
        {typeof children === 'function' ? children(isActive) : children}
      </a>
    </LinkRouter>
  );
};
