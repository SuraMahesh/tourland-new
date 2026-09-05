// Build-time only: renders a route to static HTML for scripts/prerender.mjs.
// The browser bundle never imports this file. The output is a paint-only
// placeholder — main.tsx still mounts with createRoot, which replaces the
// static DOM with the live app on load.
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { PassThrough } from 'node:stream';
import { AppContent } from './App';

export function renderPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={url}>
          <AppContent />
        </StaticRouter>
      </StrictMode>,
      {
        // onAllReady waits for lazy route chunks so the full page renders,
        // not the Suspense fallback.
        onAllReady() {
          let html = '';
          const sink = new PassThrough();
          sink.on('data', (chunk) => {
            html += chunk;
          });
          sink.on('end', () => resolve(html));
          stream.pipe(sink);
        },
        onError(error) {
          reject(error);
        },
      },
    );
  });
}
