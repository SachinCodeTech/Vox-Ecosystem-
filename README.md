# Vox Ecosystem

Vox Ecosystem is a unified React application launcher for CodeTech Developers' suite of tools (VoxCADD, Arch Pad Pro, 10to7, and Interior Bot).

## Features

- **Unified Launcher**: One installable home screen providing instant access to all Vox applications.
- **Live Status Monitoring**: Real-time checking of service availability with fail-safe offline fallback.
- **App Search**: Instant filter across all applications by title or description.
- **Admin Console**: Hidden administration panel (unlocked via tapping the Version row 5 times in Info) allowing administrators to stop or resume individual services, customize downtime messages, and publish status updates directly to GitHub via fine-grained PAT tokens.
- **PWA Ready**: Offline support with service worker, web manifest, and install prompts.
- **Responsive & Faithful UI**: Dark mode interface with neon gradients, smooth transitions, and mobile-first bottom navigation.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
