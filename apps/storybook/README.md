# Storybook

Install dependencies from the monorepo root:

```bash
npm install
```

## Development Server

Use the default local app hostname:

```text
storybook.local.hoite.dev
```

Add this to your local hosts file unless you have a local DNS setup:

```text
127.0.0.1 storybook.local.hoite.dev
```

Start the development server:

```bash
npm run dev
```

The shared local-domain and wildcard SSL setup is documented in the root [README.md](../../README.md#local-ssl).

Storybook uses the shared repo-level wildcard certificate from `ssl/` so it can run on the local app domain over HTTPS.

The local Storybook URL is:

```text
https://storybook.local.hoite.dev:6006
```
