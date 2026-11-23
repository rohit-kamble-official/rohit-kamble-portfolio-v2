import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import App from './App.jsx'

/**
 * Static prerender: waits for every lazy section and emits them inline.
 * `progressiveChunkSize: Infinity` disables React's progressive "outlining" of large
 * Suspense boundaries, so the HTML is complete and readable without JavaScript.
 */
export async function render() {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <App />
    </StrictMode>,
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )
  let html = ''
  for await (const chunk of prelude) html += typeof chunk === 'string' ? chunk : chunk.toString('utf8')
  return html
}
