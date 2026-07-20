# Arcana Local-First Multimedia HTML Journal

A polished private journal built with Next.js App Router, React, strict TypeScript, Tailwind CSS, browser IndexedDB, Web Crypto, MediaRecorder, HTML import/export, and offline-friendly application shell caching.

## Architecture and project structure

```text
src/app                 App Router pages: library, new/edit/read entry, import, settings
src/components/journal  Library, entry readers, IndexedDB-backed loaders
src/components/editor   Rich semantic HTML editor with autosave, media, lock controls
src/components/media    Media helpers and future specialized panels
src/components/covers   Cover art and generated typography covers
src/components/security Password locking UI and crypto workflows
src/components/import-export Import, standalone HTML export, backup panels
src/db                  IndexedDB database wrapper and repository abstractions
src/lib/crypto          AES-GCM/PBKDF2 encryption utilities
src/lib/export          Self-contained HTML export generator
src/lib/import          Safe HTML import parser
src/lib/media           Blob/data URL conversion and MediaRecorder feature detection
src/lib/sanitization    Aggressive semantic HTML sanitizer
src/lib/validation      Schema guards designed for Zod-style migration validation
src/tests               Vitest coverage for crypto, sanitization, export
```

The UI never talks directly to IndexedDB; it uses repository services so cloud sync can be introduced later behind the same domain methods.

## Installation and running

```bash
npm install
npm run dev
npm run build
npm start
```

## Database schema

IndexedDB database `html-journal` version 1 contains four stores:

- `entries` keyed by `id`, indexed by `updatedAt`.
- `assets` keyed by `id`, indexed by `entryId`; images, covers, and audio are stored as `Blob` records, not base64.
- `tags` keyed by `name` for future tag analytics.
- `settings` keyed by `id` for theme, PBKDF2 work factor, relock period, and last-backup date.

## Local storage model

All journal data lives in the current browser profile. Clearing site data can delete the journal. Private/incognito sessions may not preserve data. Create backups regularly from Settings.

## Password encryption

Locking an entry serializes private content and encrypts it with AES-GCM using a 256-bit key derived from the password by PBKDF2/SHA-256. Each encryption uses a random salt and unique random IV. The password, password hash, and derived key are never stored. If the password is forgotten, the ciphertext cannot be recovered by the app.

Security boundary: encryption protects at-rest journal contents in this browser profile and exported locked HTML files. It does not protect against malware, browser extensions, screen recording, screenshots, or compromised devices.

## Standalone HTML exports

Each entry can be exported as a single `.html` file with inline CSS, inline JavaScript, embedded metadata, cover screen, journal HTML, and embedded media data URLs. The app stores blobs in IndexedDB and only converts media to data URLs during export. Locked exports contain encryption metadata and ciphertext plus inline Web Crypto unlock code; they do not include plaintext content.

To verify a locked export contains no plaintext, export a locked entry and search the file text for a private phrase from the entry. The phrase should not appear.

## Import

The import route accepts app-generated exports and ordinary HTML. App metadata is read from a JSON script tag and restored with new internal IDs. Ordinary HTML is parsed without execution, scripts and dangerous embedded content are removed, and a preview is shown before/while committing.

## Backup and restore

Settings provides full-journal JSON backup with entries and media encoded for portability, plus restore/merge. Backups are separate from individual standalone HTML exports.

## Media and browser differences

Images are stored as blobs and previewed with object URLs. Audio recording uses `MediaRecorder.isTypeSupported()` to choose WebM/Opus, WebM, MP4, or Ogg when available. Safari, Firefox, and Chromium support different recording containers. Test microphone recording on HTTPS or localhost and grant microphone permission when prompted.

## Testing

```bash
npm run test
npm run test:e2e
npm run build
```

Vitest covers encryption round trips, wrong-password rejection, sanitization, filename sanitization, and standalone HTML generation. Playwright covers the primary create/search/delete flow and is structured for media, locking, export, and import expansion.

## Deployment

Deploy as a static-capable Next.js application to any Node-compatible host such as Vercel, Netlify Next runtime, or a self-hosted Node server. No backend services or environment variables are required. HTTPS is recommended for microphone APIs outside localhost.
