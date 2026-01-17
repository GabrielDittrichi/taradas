# Sanity.io Guide & Documentation Index

## 1. Project Details
- **Project Name**: Magnolia Lunar
- **Project ID**: `2ll603bs`
- **Dataset**: `production`
- **Studio Path**: `/sanity-studio`

## 2. Overview
Sanity is a unified content platform that powers better digital experiences. It treats content as data, allowing you to build backend-agnostic applications.
- **Sanity Studio**: A real-time, open-source CMS (React-based) that you can customize.
- **Content Lake**: A cloud-hosted database for your content, accessible via API.

## 3. Quickstart & Initialization
Project initialized with:
```bash
npm create sanity@latest -- --project 2ll603bs --dataset production --template clean --output-path sanity-studio --typescript --no-impure-render
```

## 4. Core Concepts
- **Schemas**: Define your content types (documents, objects, fields). Located in the `schemaTypes` folder.
- **GROQ**: Graph-Relational Object Queries. Sanity's query language to fetch specific data.
- **Portable Text**: A JSON-based rich text specification that allows you to render content on any device/platform.

## 5. Useful Links
- [Official Documentation](https://www.sanity.io/docs)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/groq-cheat-sheet)
- [Sanity Studio Docs](https://www.sanity.io/docs/sanity-studio)
- [Client Library (@sanity/client)](https://www.sanity.io/docs/js-client)

## 6. Next Steps for This Project
1.  **Define Schemas**: Create schemas for `Massage`, `Therapist`, `Review`, etc.
2.  **Connect Frontend**: Use `next-sanity` in the Next.js app to fetch content.
3.  **Customize Studio**: Add branding, custom input components, or dashboard widgets if needed.
