# Project information

![Nuxt version](https://img.shields.io/badge/Nuxt%20version-4.4.2-00DC82)

## Stack
- Nuxt
- Vite
- Pinia
- TypeScript
- PostCSS


# Project setup

## Nuxt 

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Install dependencies from the monorepo root:

```bash
npm install
```

### SSL certificates for local development

`mkcert` is a simple tool for creating locally-trusted development certificates.

1. **Install mkcert** using [Chocolatey](https://chocolatey.org/) or download it manually from the [mkcert GitHub releases page](https://github.com/FiloSottile/mkcert/releases).
   - **Using Chocolatey** (if you have it installed):
     ```powershell
     choco install mkcert -y
     ```
   - **Manually**:
     1. Download `mkcert.exe` from the [releases page](https://github.com/FiloSottile/mkcert/releases).
     2. Add `mkcert.exe` to a directory that's included in your system's `PATH` (e.g., `C:\Tools\`).

2. **Install the local root CA**:
   ```powershell
   mkcert -install
   ```
3. **Reboot Visual Studio code**

4. **Navigate to `apps/site-nuxt`.**

  - **Run the following command to generate the shared local SSL certificates in the `ssl` folder**
     ```powershell
    mkdir ssl; mkcert -cert-file ./ssl/local.hoite.dev.pem -key-file ./ssl/local.hoite.dev-key.pem local.hoite.dev *.local.hoite.dev
     ```

### Working with HTTPS locally

If you're running the Umbraco instance locally, its certificate may not be trusted by Node. As a local workaround, add the following to your local `.env` file:
```NODE_TLS_REJECT_UNAUTHORIZED=0```

This is only required for local development and **must not** be used in staging or production.

---
### Development Server

Use the default local app hostname:

```text
site-nuxt.local.hoite.dev
```

Add this to your local hosts file unless you have a local DNS setup:

```text
127.0.0.1 site-nuxt.local.hoite.dev
```

Set the canonical/public site URL explicitly with `NUXT_PUBLIC_SITE_BASE_URL`.

Set the Umbraco content root explicitly with `NUXT_UMBRACO_START_ITEM`.

This lets the frontend run locally while still behaving as the correct public site and querying the correct Umbraco root.

Start the development server:

```bash
npm run dev
```

### Multilingual

Locales are path-based in this app.

Examples:

```text
/en/
/da/
```

The app resolves the locale from the first path segment.

The root path `/` redirects to `NUXT_PUBLIC_FALLBACK_LOCALE`.

Other routes must start with a valid locale such as `/en/` or `/da/`.

Invalid or non-localized routes return a 404 via [`middleware/enforce-locale.global.ts`](./middleware/enforce-locale.global.ts).

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
