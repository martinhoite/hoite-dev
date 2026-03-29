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

4. **Navigate to `apps/nuxt-app`.**

  - **Run the following command to generate the SSL certificates in the `ssl`folder**
    ```powershell
    mkdir ssl;  mkcert -cert-file ./ssl/local.hoite.dev.pem -key-file ./ssl/local.hoite.dev-key.pem local.hoite.dev
    ```

### Working with HTTPS locally

If you're running the Umbraco instance locally, its self-signed certificate is not trusted by Node. Server side requests from the frontend may fail because of this. As a workaround, add the following to your local `.env` file:
```NODE_TLS_REJECT_UNAUTHORIZED=0```

This is only required for local development and **must not** be used in staging or production. The underlying trust issue may be resolved later so this workaround is no longer needed.

---
### Development Server

Start the development server on `https://local.hoite.dev:3000`:

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
