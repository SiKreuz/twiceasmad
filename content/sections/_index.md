---
# These pages are content fragments for the homepage one-pager, NOT standalone pages.
# render:never  -> no /sections/* URL is generated (removes duplicate-content URLs from the sitemap)
# list:always   -> they stay in .Site.RegularPages so the homepage loop + nav still render them inline
title: "Sections"
build:
  render: never
  list: never
cascade:
  build:
    render: never
    list: always
---
