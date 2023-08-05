import { TemplateHeader } from './Header';

interface TemplateLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const TemplateLayout: React.FC<TemplateLayoutProps> = ({
  title,
  children,
}) => (
  // <!DOCTYPE html>\n
  <html lang='en'>
    <head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width' />
      <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
      <link rel="stylesheet" href="./style.css" />
      {/* <meta name='generator' content={Astro.generator} /> */}
      <title>{title}</title>
    </head>
    <body data-theme='light'>
      <TemplateHeader />
      <main>{children}</main>
    </body>
  </html>
);
