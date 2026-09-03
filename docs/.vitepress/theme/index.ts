import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { inBrowser } from 'vitepress'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (inBrowser) {
      import('./mermaid-panzoom').then(({ initMermaidPanZoom }) => {
        const setup = () => {
          initMermaidPanZoom()

          // MutationObserver to catch asynchronous Mermaid SVG rendering
          const observer = new MutationObserver(() => {
            initMermaidPanZoom()
          })
          observer.observe(document.body, { childList: true, subtree: true })
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', setup)
        } else {
          setup()
        }

        router.onAfterRouteChanged = () => {
          setTimeout(initMermaidPanZoom, 150)
          setTimeout(initMermaidPanZoom, 600)
        }
      })
    }
  }
} satisfies Theme
