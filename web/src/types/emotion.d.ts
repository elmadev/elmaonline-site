import '@emotion/react';
import type { themes } from 'theme';

type SiteTheme = (typeof themes)[number];

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends SiteTheme {}
}
