# Quick Reference - Embedded Form Demo

## 🚀 Getting Started (30 seconds)

```bash
# Terminal 1 - Site 1
cd site-1-form && npm install && npm run dev

# Terminal 2 - Site 2
cd site-2-embedder && npm install && npm run dev
```

Open: `http://localhost:5174`

---

## 📁 Project Structure

```
site-1-form/          → Form provider (port 5173)
  └── /form           → The embeddable form

site-2-embedder/      → Embedder (port 5174)
  └── /               → Page with embedded form
```

---

## 🔄 PostMessage API

### Site 1 Sends (to parent)

```javascript
// Height update
{ type: 'form-height', height: 1234 }

// Form submitted
{ type: 'form-submitted', data: { name, email, phone, topic, message, subscribe } }
```

### Site 2 Sends (to iframe)

```javascript
// Theme change
{ type: 'theme-change', theme: 'dark' | 'light' }
```

---

## 🔧 Key Files to Modify

### Site 1
- `src/pages/FormPage.jsx` - Form logic and fields
- `src/index.css` - Theme colors

### Site 2
- `src/App.jsx` - Change `formUrl` variable
- `src/components/EmbedCard.jsx` - Iframe behavior
- `src/index.css` - Theme colors

---

## 🎨 Customization Shortcuts

### Change Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Blue */
  --destructive: 0 84.2% 60.2%;  /* Red */
}
```

### Add Form Field
1. Add to `formData` state
2. Add validation in `handleSubmit`
3. Add component in JSX with label + error handling

### Change Iframe URL
In `site-2-embedder/src/App.jsx`:
```javascript
const formUrl = "YOUR_URL_HERE";
```

---

## 🔒 Security (For Production)

### Site 1: Replace ALL instances of `'*'` with parent URL
```javascript
window.parent.postMessage(data, 'https://your-parent.com');
```

### Site 2: Add origin check
```javascript
if (event.origin !== "https://your-iframe.com") return;
```

---

## 🌐 Deploy Commands

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Vercel
```bash
npm run build
vercel --prod
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Iframe not loading | Check console, verify URLs |
| Height not adjusting | Check postMessage in console |
| Theme not syncing | Verify iframe loaded, check messages |
| Form validation broken | Check console for JS errors |
| Toast not appearing | Check form submission event |

---

## ✅ Testing Checklist (5 min)

- [ ] Form loads
- [ ] Auto-resize works
- [ ] Validation works
- [ ] Submission shows toast
- [ ] Theme sync works
- [ ] Mobile responsive
- [ ] No console errors

---

## 📊 Performance Tips

- ✅ Both apps use Vite (fast builds)
- ✅ ResizeObserver (efficient height updates)
- ✅ Lazy iframe loading
- ✅ Optimized with Tailwind CSS purging

---

## 🎯 Common Customizations

### 1. Change Form Fields
→ Edit `FormPage.jsx`

### 2. Change Theme Colors
→ Edit `index.css` in both projects

### 3. Change Iframe URL
→ Edit `App.jsx` in site-2-embedder

### 4. Add More Validation
→ Add checks in `handleSubmit` function

### 5. Customize Toast
→ Edit `SuccessToast.jsx`

---

## 📞 Need Help?

1. Check main README.md
2. Check TESTING_GUIDE.md
3. Check DEPLOYMENT_GUIDE.md
4. Check browser console for errors

---

## 🔑 Important Notes

⚠️ **Never deploy with `postMessage(data, '*')` in production**

✅ **Always verify `event.origin` in message handlers**

✅ **Use HTTPS in production for both sites**

✅ **Test theme sync and auto-resize after any changes**

---

## 📦 Dependencies

Both projects use:
- React 18
- Vite 5
- Tailwind CSS 3
- Lucide React (icons)
- shadcn/ui (components)

No backend required - 100% client-side!

---

## 🎉 Quick Wins

- Works locally immediately
- No backend setup needed
- Production-ready code
- Fully accessible (ARIA)
- Mobile responsive
- Dark mode included
- Auto-height iframe
- Security-conscious
- Well-documented

---

**Last Updated**: Nov 2024  
**React Version**: 18.3+  
**Node Version**: 18+