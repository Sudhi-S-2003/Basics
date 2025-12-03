# Site 1 - Form Provider

This is the form provider application that hosts the embeddable contact form at `/form`.

## Features

- ✅ Clean, modern form UI with validation
- ✅ Auto-height communication via postMessage
- ✅ Dark mode support
- ✅ Fully accessible (ARIA labels, keyboard navigation)
- ✅ Responsive design (mobile-first)
- ✅ Real-time validation feedback
- ✅ Success state with auto-reset

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

The app will be available at `http://localhost:5173`

The embeddable form is at: `http://localhost:5173/form`

### Build for Production

```bash
npm run build
```

The production files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Or connect your Git repository to Netlify for automatic deployments.

### Vercel

```bash
npm run build
vercel --prod
```

Or use the Vercel dashboard to connect your repository.

## PostMessage API

This application communicates with parent iframes using `postMessage`:

### Outgoing Messages

1. **Height Updates**
   ```javascript
   {
     type: 'form-height',
     height: 1234 // pixels
   }
   ```
   Sent on mount, resize, and content changes.

2. **Form Submission**
   ```javascript
   {
     type: 'form-submitted',
     data: {
       name: "John Doe",
       email: "john@example.com",
       phone: "+1234567890",
       topic: "general",
       message: "Hello...",
       subscribe: true
     }
   }
   ```

### Incoming Messages

1. **Theme Change**
   ```javascript
   {
     type: 'theme-change',
     theme: 'dark' // or 'light'
   }
   ```

## Security Notes

⚠️ **Important**: This demo uses `"*"` as the target origin in `postMessage` calls. In production:

1. Replace all instances of `"*"` with your specific parent domain:
   ```javascript
   window.parent.postMessage(data, 'https://your-parent-domain.com');
   ```

2. Add origin verification for incoming messages:
   ```javascript
   const handleMessage = (event) => {
     if (event.origin !== "https://your-parent-domain.com") return;
     // Handle message
   };
   ```

## Cross-Origin Testing

To test the iframe embedding locally:

1. Run Site 1 on port 5173: `npm run dev`
2. Run Site 2 on port 5174: `cd ../site-2-embedder && npm run dev`
3. Open Site 2 and change the iframe src to `http://localhost:5173/form`

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

## Form Validation

- Name: Required, non-empty
- Email: Required, valid email format
- Phone: Required, min 10 digits
- Topic: Required selection
- Message: Required, non-empty
- Subscribe: Optional checkbox

## License

MIT