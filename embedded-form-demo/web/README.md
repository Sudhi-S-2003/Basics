# Site 2 - Form Embedder

This is the embedder application that displays Site 1's form in a seamless, native-looking iframe.

## Features

- ✅ Seamless iframe embedding with auto-height
- ✅ Dark/light mode toggle with sync to embedded form
- ✅ Native success toast when form is submitted
- ✅ Fallback handling for loading issues
- ✅ Fully responsive design
- ✅ Loading states and error handling

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5174`

### Build for Production

```bash
npm run build
```

The production files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Changing the Iframe URL

In `src/App.jsx`, update the `formUrl` constant:

```javascript
// For local development
const formUrl = "http://localhost:5173/form";

// For production
const formUrl = "https://your-site1-domain.com/form";
```

## PostMessage Communication

This application listens for messages from the embedded iframe:

### Incoming Messages

1. **Height Updates**
   ```javascript
   {
     type: 'form-height',
     height: 1234
   }
   ```
   Automatically resizes the iframe to fit content.

2. **Form Submission**
   ```javascript
   {
     type: 'form-submitted',
     data: { name, email, phone, topic, message, subscribe }
   }
   ```
   Displays a success toast with submission details.

### Outgoing Messages

1. **Theme Change**
   ```javascript
   {
     type: 'theme-change',
     theme: 'dark' // or 'light'
   }
   ```
   Sent to iframe when theme toggle is clicked.

## Security Notes

⚠️ **Important**: This demo uses `"*"` as the target origin in `postMessage` calls. In production:

1. **Verify message origin** in `src/components/EmbedCard.jsx`:
   ```javascript
   const handleMessage = (event) => {
     // Add origin check
     if (event.origin !== "https://your-form-domain.com") return;
     
     if (event.data.type === 'form-height') {
       setIframeHeight(event.data.height);
     }
   };
   ```

2. **Specify target origin** when sending messages:
   ```javascript
   iframeRef.current.contentWindow.postMessage(
     { type: 'theme-change', theme },
     'https://your-form-domain.com' // Specific origin
   );
   ```

## Deployment

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Or connect your Git repository to Netlify.

### Vercel

```bash
npm run build
vercel --prod
```

Or use the Vercel dashboard.

## Testing Cross-Origin Locally

To test the iframe embedding with proper cross-origin behavior:

1. Run Site 1 on port 5173:
   ```bash
   cd ../site-1-form
   npm run dev
   ```

2. Run Site 2 on port 5174:
   ```bash
   cd ../site-2-embedder
   npm run dev
   ```

3. Open `http://localhost:5174` in your browser

4. The iframe will load Site 1's form from `http://localhost:5173/form`

Both apps use `--host` flag to expose servers to the network, simulating cross-origin behavior even locally.

## Features Explained

### Auto-Height Resize

The iframe automatically adjusts its height based on messages from the embedded form, creating a seamless appearance without scrollbars.

### Theme Synchronization

When you toggle the theme in Site 2, it sends a message to the embedded form to update its theme, maintaining visual consistency.

### Success Toast

When the form is submitted, Site 2 displays a native toast notification with the submitted data, providing feedback outside the iframe context.

### Error Handling

If the iframe doesn't send height messages within 3 seconds, Site 2:
- Sets a default height (800px)
- Shows a fallback link to open the form in a new tab

## Customization

### Styling

All styles use Tailwind CSS with CSS variables for theming. Customize colors in `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  /* ... other variables */
}
```

### Timeout Duration

Adjust the loading timeout in `src/components/EmbedCard.jsx`:

```javascript
setTimeout(() => {
  setHasError(true);
}, 3000); // Change this value (milliseconds)
```

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React icons

## License

MIT