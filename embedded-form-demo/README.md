# Seamless Embedded Form Demo

A complete, production-ready demonstration of seamless form embedding using React, similar to Google Forms. This project consists of two independent React applications that communicate via `postMessage` API to create a native-looking embedded experience.

## 🎯 Overview

**Site 1 (Form Provider)** hosts a beautiful, accessible contact form that can be embedded anywhere.

**Site 2 (Embedder)** displays Site 1's form in an iframe that looks completely native - no visible iframe borders, automatic height adjustment, and synchronized theming.

## ✨ Key Features

### Form Provider (Site 1)
- ✅ Modern, accessible form with full validation
- ✅ Auto-height communication via postMessage
- ✅ Dark mode support with theme sync
- ✅ Responsive design (mobile-first)
- ✅ ARIA labels and keyboard navigation
- ✅ Success state with auto-reset

### Embedder (Site 2)
- ✅ Seamless iframe embedding
- ✅ Auto-resizing based on content
- ✅ Native-looking success toast
- ✅ Dark/light mode toggle
- ✅ Theme synchronization with iframe
- ✅ Error handling and fallbacks
- ✅ Loading states

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation & Running

1. **Clone or download this project**

2. **Install and run Site 1 (Form Provider)**
   ```bash
   cd site-1-form
   npm install
   npm run dev
   ```
   Site 1 will run on `http://localhost:5173`

3. **Install and run Site 2 (Embedder)** (in a new terminal)
   ```bash
   cd site-2-embedder
   npm install
   npm run dev
   ```
   Site 2 will run on `http://localhost:5174`

4. **Open your browser**
   - Visit `http://localhost:5174` to see Site 2 with the embedded form
   - Visit `http://localhost:5173/form` to see Site 1's form standalone

## 📁 Project Structure

```
embedded-form-demo/
├── site-1-form/                 # Form provider application
│   ├── src/
│   │   ├── components/ui/       # shadcn/ui components
│   │   ├── pages/
│   │   │   └── FormPage.jsx    # Main form component
│   │   ├── lib/utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
└── site-2-embedder/             # Embedder application
    ├── src/
    │   ├── components/
    │   │   ├── EmbedCard.jsx    # Iframe container
    │   │   ├── ThemeToggle.jsx   # Theme switcher
    │   │   └── SuccessToast.jsx  # Success notification
    │   ├── lib/utils.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── README.md
```

## 🔄 PostMessage Communication Flow

### Site 1 → Site 2

1. **Height Updates** (on mount, resize, content change)
   ```javascript
   {
     type: 'form-height',
     height: 1234  // pixels
   }
   ```

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

### Site 2 → Site 1

1. **Theme Change**
   ```javascript
   {
     type: 'theme-change',
     theme: 'dark'  // or 'light'
   }
   ```

## 🔒 Security Configuration

⚠️ **CRITICAL**: This demo uses `"*"` as the postMessage origin for ease of testing. **You MUST change this in production!**

### Site 1 Changes Required

In `site-1-form/src/pages/FormPage.jsx`:

```javascript
// Replace all instances of:
window.parent.postMessage(data, '*');

// With:
window.parent.postMessage(data, 'https://your-site2-domain.com');

// And add origin verification:
const handleMessage = (event) => {
  if (event.origin !== "https://your-site2-domain.com") return;
  // Handle message
};
```

### Site 2 Changes Required

In `site-2-embedder/src/components/EmbedCard.jsx`:

```javascript
// Add origin verification:
const handleMessage = (event) => {
  if (event.origin !== "https://your-site1-domain.com") return;
  // Handle message
};

// Replace all instances of:
iframeRef.current.contentWindow.postMessage(data, '*');

// With:
iframeRef.current.contentWindow.postMessage(data, 'https://your-site1-domain.com');
```

In `site-2-embedder/src/App.jsx`:

```javascript
// Change the iframe URL:
const formUrl = "https://your-site1-domain.com/form";
```

## 🌐 Deployment

### Site 1 (Form Provider)

#### Netlify
```bash
cd site-1-form
npm run build
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
cd site-1-form
npm run build
vercel --prod
```

### Site 2 (Embedder)

#### Netlify
```bash
cd site-2-embedder
npm run build
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
cd site-2-embedder
npm run build
vercel --prod
```

### Post-Deployment Steps

1. Update `formUrl` in Site 2's `App.jsx` with Site 1's production URL
2. Update all `postMessage` origins with production domains
3. Test the integration thoroughly

## 🧪 Testing Checklist

- [ ] **Embed works**: Form loads in Site 2's iframe
- [ ] **Auto-resize works**: Iframe height adjusts to content
- [ ] **Form validation works**: Error messages display correctly
- [ ] **Form submission works**: Success toast appears in Site 2
- [ ] **Toast displays data**: Name and email shown correctly
- [ ] **Toast dismisses**: Click X or auto-dismiss after 8 seconds
- [ ] **Theme sync works**: Toggling theme in Site 2 updates form
- [ ] **Dark mode works**: Both sites render correctly in dark mode
- [ ] **Responsive**: Works on mobile, tablet, and desktop
- [ ] **Keyboard navigation**: All form fields accessible via Tab
- [ ] **Loading state**: Shows spinner while iframe loads
- [ ] **Error fallback**: Shows "open in new tab" link after timeout
- [ ] **Form reset works**: Form clears after successful submission

## 🎨 Customization

### Colors & Theming

Both apps use CSS variables for theming. Edit `src/index.css` in each project:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... more variables */
}
```

### Form Fields

To add/modify form fields, edit `site-1-form/src/pages/FormPage.jsx`:

1. Add to `formData` state
2. Add validation in `handleSubmit`
3. Add input component with proper labels and error handling

### Iframe Styling

To adjust iframe appearance, edit `site-2-embedder/src/components/EmbedCard.jsx`:

- Border radius: Change `rounded-lg`
- Shadow: Change `shadow-xl`
- Border: Change `border border-border`

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Accessible component primitives
- **Lucide React** - Icon library
- **React Router** - Routing (Site 1)

## 📝 Additional Notes

### Why Two Separate Apps?

This architecture allows:
- Independent deployment and scaling
- Different domains/subdomains
- Reuse of form across multiple sites
- Clear separation of concerns

### Performance Considerations

- Both apps are optimized with Vite
- Lazy loading for iframe
- ResizeObserver for efficient height updates
- Minimal re-renders with proper React patterns

### Accessibility

- ARIA labels on all form inputs
- Proper focus management
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance

## 🐛 Troubleshooting

### Iframe not loading
- Check that both servers are running
- Verify the `formUrl` in Site 2's `App.jsx`
- Check browser console for errors

### Height not adjusting
- Verify postMessage is being sent (check console)
- Ensure origin restrictions aren't blocking messages
- Check that ResizeObserver is supported (all modern browsers)

### Theme not syncing
- Verify postMessage from Site 2 is being received by Site 1
- Check that the iframe has loaded (`onLoad` event fired)
- Ensure theme classes are being applied to `document.documentElement`

### Form validation not working
- Check browser console for JavaScript errors
- Verify all required fields have `name` attributes
- Ensure validation functions are being called

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Need help?** Check the individual README files in each project directory for more detailed information.