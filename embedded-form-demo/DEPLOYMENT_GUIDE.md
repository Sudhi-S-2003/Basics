# Deployment Guide - Embedded Form Demo

Complete guide for deploying both applications to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing (see TESTING_GUIDE.md)
- [ ] Code committed to Git repository
- [ ] Environment variables documented
- [ ] Production domains decided
- [ ] SSL certificates ready (or using platform defaults)

---

## 🌐 Deployment Strategy

You have two options:

### Option A: Same Domain, Different Paths
- Site 1: `https://example.com/form`
- Site 2: `https://example.com`

**Pros**: No CORS issues, simpler security
**Cons**: Both must be deployed together

### Option B: Different Domains (Recommended)
- Site 1: `https://forms.example.com`
- Site 2: `https://www.example.com`

**Pros**: Independent deployment, better separation
**Cons**: Need to configure CORS/postMessage properly

---

## 🚀 Deploying to Netlify

### Site 1 (Form Provider)

1. **Build the Project**
   ```bash
   cd site-1-form
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   # Install Netlify CLI (if not installed)
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Or Deploy via Netlify Dashboard**
   - Go to https://app.netlify.com
   - Click "Add new site" > "Import an existing project"
   - Connect your Git repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Base directory: `site-1-form`
   - Click "Deploy site"

4. **Configure Custom Domain** (Optional)
   - Go to Site settings > Domain management
   - Add custom domain: `forms.example.com`
   - Follow DNS configuration instructions

5. **Note Your Site URL**
   - Example: `https://your-site-name.netlify.app/form`
   - Or: `https://forms.example.com/form`

### Site 2 (Embedder)

1. **Update Form URL First**
   
   Edit `site-2-embedder/src/App.jsx`:
   ```javascript
   // Change this line
   const formUrl = "http://localhost:5173/form";
   
   // To your deployed Site 1 URL
   const formUrl = "https://your-site-name.netlify.app/form";
   // or
   const formUrl = "https://forms.example.com/form";
   ```

2. **Build the Project**
   ```bash
   cd site-2-embedder
   npm run build
   ```

3. **Deploy via Netlify CLI**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Or Deploy via Netlify Dashboard**
   - Same steps as Site 1
   - Base directory: `site-2-embedder`

5. **Configure Custom Domain** (Optional)
   - Add: `www.example.com` or `example.com`

---

## 🔷 Deploying to Vercel

### Site 1 (Form Provider)

1. **Install Vercel CLI** (if not installed)
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd site-1-form
   vercel --prod
   ```

4. **Or Deploy via Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Click "Add New" > "Project"
   - Import your Git repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: `site-1-form`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"

5. **Note Your Site URL**
   - Example: `https://your-project.vercel.app/form`

### Site 2 (Embedder)

1. **Update Form URL** (same as Netlify instructions above)

2. **Deploy**
   ```bash
   cd site-2-embedder
   vercel --prod
   ```

3. **Or use Vercel Dashboard** (same steps as Site 1)

---

## 🔒 Security Configuration (CRITICAL)

After deployment, you **MUST** update the postMessage security settings.

### Site 1 Changes

Edit `site-1-form/src/pages/FormPage.jsx`:

```javascript
// BEFORE (development):
window.parent.postMessage({ type: 'form-height', height }, '*');

// AFTER (production):
window.parent.postMessage(
  { type: 'form-height', height },
  'https://www.example.com'  // Your Site 2 URL
);

// BEFORE (development):
window.parent.postMessage({ type: 'form-submitted', data: formData }, '*');

// AFTER (production):
window.parent.postMessage(
  { type: 'form-submitted', data: formData },
  'https://www.example.com'  // Your Site 2 URL
);
```

Also add origin verification:

```javascript
const handleMessage = (event) => {
  // Add this check
  if (event.origin !== "https://www.example.com") {
    console.warn('Message from untrusted origin:', event.origin);
    return;
  }
  
  if (event.data.type === 'theme-change') {
    setTheme(event.data.theme);
    document.documentElement.classList.toggle('dark', event.data.theme === 'dark');
  }
};
```

### Site 2 Changes

Edit `site-2-embedder/src/components/EmbedCard.jsx`:

```javascript
// Add origin verification
const handleMessage = (event) => {
  // Add this check
  if (event.origin !== "https://forms.example.com") {
    console.warn('Message from untrusted origin:', event.origin);
    return;
  }
  
  if (event.data.type === 'form-height') {
    setIframeHeight(event.data.height);
    // ... rest of code
  }
};

// Update postMessage calls
// BEFORE:
iframeRef.current.contentWindow.postMessage(
  { type: 'theme-change', theme },
  '*'
);

// AFTER:
iframeRef.current.contentWindow.postMessage(
  { type: 'theme-change', theme },
  'https://forms.example.com'  // Your Site 1 URL
);
```

### Redeploy After Security Changes

```bash
# Site 1
cd site-1-form
npm run build
netlify deploy --prod --dir=dist
# or
vercel --prod

# Site 2
cd site-2-embedder
npm run build
netlify deploy --prod --dir=dist
# or
vercel --prod
```

---

## 🌍 Environment-Specific Configuration

For managing different environments (dev, staging, prod):

### Option 1: Environment Variables

Create `.env` files:

**site-1-form/.env.production**
```env
VITE_PARENT_ORIGIN=https://www.example.com
```

**site-2-embedder/.env.production**
```env
VITE_FORM_URL=https://forms.example.com/form
VITE_FORM_ORIGIN=https://forms.example.com
```

Then use in code:

```javascript
// Site 1
window.parent.postMessage(data, import.meta.env.VITE_PARENT_ORIGIN);

// Site 2
const formUrl = import.meta.env.VITE_FORM_URL;
if (event.origin !== import.meta.env.VITE_FORM_ORIGIN) return;
```

### Option 2: Config File

Create `src/config.js`:

```javascript
const config = {
  development: {
    formUrl: 'http://localhost:5173/form',
    formOrigin: 'http://localhost:5173',
    parentOrigin: 'http://localhost:5174',
  },
  production: {
    formUrl: 'https://forms.example.com/form',
    formOrigin: 'https://forms.example.com',
    parentOrigin: 'https://www.example.com',
  },
};

const env = import.meta.env.MODE || 'development';
export default config[env];
```

---

## 📊 Post-Deployment Testing

1. **Verify Basic Functionality**
   - [ ] Form loads in iframe
   - [ ] Auto-resize works
   - [ ] Form submission works
   - [ ] Toast appears
   - [ ] Theme sync works

2. **Test from Different Networks**
   - [ ] Desktop browser
   - [ ] Mobile browser
   - [ ] Different ISP/network

3. **Check Console for Errors**
   - [ ] No JavaScript errors
   - [ ] No postMessage warnings
   - [ ] No CORS errors

4. **Performance Check**
   - Run Lighthouse audit
   - Target scores: 90+ in all categories
   
5. **Security Verification**
   - [ ] HTTPS enabled
   - [ ] Origin restrictions working
   - [ ] No mixed content warnings

---

## 🔧 Troubleshooting Production Issues

### Issue: Iframe Not Loading

**Possible Causes:**
1. Incorrect URL in Site 2
2. HTTPS/HTTP mismatch
3. CORS blocking

**Solutions:**
- Check browser console for errors
- Verify `formUrl` in App.jsx
- Ensure both sites use HTTPS
- Check Content Security Policy headers

### Issue: PostMessage Not Working

**Possible Causes:**
1. Origin mismatch
2. Iframe not loaded yet
3. Wrong domain specified

**Solutions:**
- Check console for origin warnings
- Verify origins match deployed URLs
- Ensure iframe `onLoad` fires
- Test with `"*"` temporarily (never in production long-term)

### Issue: Theme Not Syncing

**Possible Causes:**
1. Message blocked by origin check
2. Iframe hasn't loaded
3. Event listener not registered

**Solutions:**
- Verify theme-change messages in console
- Check iframe load state
- Ensure postMessage sent after iframe loads

### Issue: Height Not Adjusting

**Possible Causes:**
1. ResizeObserver not supported
2. Messages blocked
3. Incorrect height calculation

**Solutions:**
- Check browser compatibility
- Verify form-height messages sent
- Test on different browsers

---

## 🚀 Advanced Deployment Options

### Using GitHub Actions for CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy-site1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install and Build
        run: |
          cd site-1-form
          npm ci
          npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './site-1-form/dist'
          production-branch: main
          deploy-message: 'Deploy from GitHub Actions'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE1_ID }}

  deploy-site2:
    runs-on: ubuntu-latest
    needs: deploy-site1
    steps:
      # Similar steps for Site 2
```

### Using Docker (Optional)

Not typically needed for static sites, but if required:

**Dockerfile for Site 1:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📝 Deployment Checklist

Final checklist before going live:

- [ ] Both sites built successfully
- [ ] Form URL updated in Site 2
- [ ] All postMessage origins updated
- [ ] Origin verification added
- [ ] Security settings tested
- [ ] Custom domains configured
- [ ] HTTPS enabled
- [ ] DNS records propagated
- [ ] All features tested in production
- [ ] Lighthouse scores > 90
- [ ] No console errors
- [ ] Mobile tested
- [ ] Analytics added (optional)
- [ ] Error monitoring setup (optional)
- [ ] Backup/version control confirmed

---

## 🎉 You're Live!

Your embedded form system is now in production. Monitor for:
- Form submissions
- Error rates
- Load times
- User feedback

## 🔄 Updating After Deployment

To push updates:

```bash
# Make changes
git add .
git commit -m "Update form validation"
git push

# Rebuild and redeploy
cd site-1-form
npm run build
netlify deploy --prod --dir=dist

cd ../site-2-embedder
npm run build
netlify deploy --prod --dir=dist
```

Or set up automatic deployments via Git integration.

---

**Need Help?** Check platform documentation:
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)