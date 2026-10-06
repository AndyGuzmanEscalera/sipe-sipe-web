// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const repoName = 'sipe-sipe-web';
const isGithubPages =
  process.env.GITHUB_ACTIONS === 'true' || process.env.PUBLIC_GITHUB_PAGES === 'true';

// https://astro.build/config
export default defineConfig({
  site: isGithubPages ? `https://andyguzmanescalera.github.io` : undefined,
  base: isGithubPages ? `/${repoName}/` : '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
