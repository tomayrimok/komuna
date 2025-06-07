# 🌟 Komuna

Welcome to **Komuna** – a modern, modular web application built with **Nx**, combining the power of **NestJS** for the backend and **React + Vite** for the frontend.

> ⚡ Fast. ✨ Scalable. 💠 Developer-friendly.

---

## 🧠 Overview

Komuna is a full-stack monorepo application designed for scalability and productivity using [Nx](https://nx.dev). The architecture includes:

- **Backend**: [`apps/server`](./apps/server) – Built with [NestJS](https://nestjs.com), a progressive Node.js framework.
- **Frontend**: [`apps/client`](./apps/client) – Powered by [React](https://react.dev) and [Vite](https://vitejs.dev) for blazing-fast development and builds.
- **Types library**: [`libs/types`](./libs/types) – Shared typescript type library for BE/FE

- **Monorepo Tooling**: Managed via [Nx](https://nx.dev), enabling efficient workspace orchestration and code sharing.

---

## 🎨 Figma Design

Explore the design prototype for Komuna on Figma:

https://www.figma.com/design/V2BrxtwUVtK9lO7UKkqbLA/Komuna-App?node-id=0-1&p=f

---

## ✨ Quick Start

### 📦 Install dependencies

```bash
npm install
```

### 🖥️ Start the backend (NestJS)

```bash
npx nx serve server
```

### 🌐 Start the frontend (React + Vite)

```bash
npx nx dev client
```

Open your browser at [http://localhost:4200](http://localhost:4200) (or configured port).

### 🌐 Enable SMS verification (ANDROID ONLY)

1. Download APK here: https://github.com/capcom6/android-sms-gateway/releases/download/v1.35.0/app-release.apk
2. Open the app, enable `local server` and click on the "OFFLINE" button to change it to online.
3. Create `.env.local` file inside `/apps/server/` with the following parameters:
   ```
   SMS_ENABLED=true
   SMS_LOCAL_ADDRESS=<yourip>:8080
   SMS_USERNAME=<yourusername>
   SMS_PASSWORD=<yourpassword>
   SMS_ALLOWED_NUMBERS=phone1,phone2,phone3..
   ```

If the sms is not enabled, all the verification codes will be `6666` by default.

---

## 📂 Project Structure

```
komuna/
├── apps/
│   ├── client/     → React + Vite frontend
│   └── server/     → NestJS backend
├── libs/
│   ├── types/      → Shared types between the BE/FE
├── tools/          → Custom Nx tooling
├── node_modules/
├── nx.json         → Nx configuration
└── package.json    → Root dependencies and scripts
```

---

## 🔧 Common Commands

### 🧪 Run Tests

```bash
npx nx test client     # React tests
npx nx test server     # NestJS tests
```

### 🛠 Build for Production

```bash
npx nx build client
npx nx build server
```

### 🔍 Visualize Project Graph

```bash
npx nx graph
```

### 🔍 Check what kind of commands you can run on a project

```bash
npx nx show project client --web
npx nx show project server --web
```

---

## ⚙️ Add a New Project

### Create a New App

```bash
npx nx g @nx/react:app my-new-client
npx nx g @nx/nest:app my-new-server
```

### Create a New Library

```bash
npx nx g @nx/js:lib shared-utils
```

Explore more with:

```bash
npx nx list
```

---

## 🧩 Recommended Tools

- [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) – Visual UI for running generators and tasks.
- [VS Code](https://code.visualstudio.com) – Fully supported IDE with great extensions.
- [Postman](https://www.postman.com/) – Great for testing your NestJS API endpoints.

---

## 🢆‍♂️ Community & Support

- [Nx Discord](https://go.nx.dev/community)
- [Nx YouTube](https://www.youtube.com/@nxdevtools)
- [NestJS Discord](https://discord.gg/nestjs)
- [React Discord](https://discord.com/invite/reactiflux)
