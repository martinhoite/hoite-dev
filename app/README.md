# Project information

![Nuxt version](https://img.shields.io/badge/Nuxt%20version-3.15.4-00DC82)
![Node version](https://img.shields.io/badge/Node%20version-22.14.0-026E00)

## Stack
- Nuxt 3
- Vite
- Pinia
- TypeScript
- PostCSS

### Libraries
- Radix-vue


# Project setup

## Nuxt 3 

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

### SSL certificates for local development

`mkcert` is a simple tool for creating locally-trusted development certificates.

**The following commands must be executed in a PowerShell window.**

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

#### Navigate to the project's app folder.

Run the following command to create the `ssl`folder (or do it manually)
```powershell
mkdir ssl
```

Generate the SSL certificates
```powershell
mkcert -cert-file ./ssl/local.hoite.dev.pem -key-file ./ssl/local.hoite.dev-key.pem local.hoite.dev
```

### Development Server

Start the development server on `https://local.hoite.dev:3000`:

```bash
# npm
npm run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.



## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License with an Additional Permission Clause.

### Non-Commercial Use
You are free to use, copy, modify, and distribute this work for non-commercial purposes with proper attribution.

### Commercial Use
Commercial use is prohibited without prior written permission. To request permission, please contact [martin@hoite.dev](mailto:martin@hoite.dev).

### Attribution
Please give appropriate credit, provide a link to the license, and indicate if changes were made.

For the full license text, see the [LICENSE](https://github.com/Blizz991/portfolio/blob/master/LICENCE.md) file.
