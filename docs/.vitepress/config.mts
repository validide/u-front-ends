import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/u-front-ends/",
  title: "@validide/u-front-ends",
  description: "Micro Front Ends",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Demo", link: "/demo/index.html", target: "_blank" },
      { text: "API", link: "/api-docs/index.html", target: "_blank" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/validide/u-front-ends" }],
    search: {
      provider: "local",
    },
    docFooter: {
      next: false,
      prev: false,
    },
  },
});
