// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Naamah Mina Stake',
  tagline: 'All about Mina Protocol',
  favicon: 'img/favicon.ico',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  trailingSlash: false,
  
  plugins: [[ require.resolve('docusaurus-lunr-search'), {
      languages: ['en', 'de'] // language codes
      }],
  ],
  
  // Set the production url of your site here
  url: 'https://mina.naamahdaemon.eu',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '', // Usually your GitHub org/user name.
  projectName: '', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en','fr'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/naamahdaemon/minaamah/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/naamahdaemon/minaamah/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-VR50WVP209',
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },        
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Naamah Mina Stake',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.png',
        },
        items: [
		  {
		    type: 'localeDropdown',
		    position: 'left',
		  },
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Introduction',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/naamahdaemon/minaamah',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
             /* {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },*/
              {
                label: 'Mina Official Discord',
                href: 'https://discord.gg/minaprotocol',
              },
              {
                label: 'Naamah Discord',
                href: 'https://discord.com/invite/ZkqQw8dK4E',
              },              
              {
                label: 'Twitter',
                href: 'https://twitter.com/naamahdaemon',
              },
              {
                label: 'Telegram',
                href: 'https://t.me/naamahdaemon',
              },       
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/naamahdaemon/minaamah',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Naamah`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    })  
};

export default config;
