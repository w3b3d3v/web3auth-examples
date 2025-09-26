# Styling Guidelines

## Styling Approach

**CSS Custom Properties (CSS Variables)** - Framework-agnostic approach using native CSS variables for theming, with **dark mode as default**.

## Global Theme Variables

```css
/* Dark Mode Variables (Default) */
:root {
  /* Web3Auth Docs Inspired Colors (Dark Mode - Bluish) */
  --primary-color: #529dff; /* Slightly adjusted blue */
  --primary-hover: #75b5ff;
  --bg-color: #171c2a; /* Dark blue-gray background */
  --bg-light: #23293d; /* Lighter blue-gray for elements */
  --bg-hover: #2f364f; /* Hover state for blue-gray */
  --border-color: #3b415c; /* Border matching blue-gray theme */
  --text-color: #e1e3e8; /* Light text */
  --text-muted: #9399a8;
  --radius: 6px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

/* Component styling with consistent patterns */
.card {
  background-color: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px;
  color: var(--text-color);
  transition: all 0.2s ease;
}

.card:hover {
  background-color: var(--bg-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.error {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 8px;
}

.loading {
  color: var(--primary-color);
}
```
