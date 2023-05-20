import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/nest-micro/',
  title: 'Nest Micro',
  description: '基于 NestJS 的微服务解决方案',
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',
    search: {
      provider: 'local',
    },
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/introduction' },
          { text: '模块总览', link: '/relation' },
          { text: '贡献指南', link: '/contribution' },
        ],
      },
      {
        text: '模块',
        items: [
          { text: 'Config', link: '/modules/config' },
          { text: 'Discovery', link: '/modules/discovery' },
          { text: 'Loadbalance', link: '/modules/loadbalance' },
          { text: 'Http', link: '/modules/http' },
          { text: 'Proxy', link: '/modules/proxy' },
          {
            text: 'Nacos',
            items: [
              { text: 'Nacos Config', link: '/modules/nacos/nacos-config' },
              { text: 'Nacos Discovery', link: '/modules/nacos/nacos-discovery' },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/nest-micro/nest-micro',
      },
    ],
  },
})
