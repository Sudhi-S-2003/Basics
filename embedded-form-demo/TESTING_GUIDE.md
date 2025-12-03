# Testing Guide - Embedded Form Demo

Complete testing checklist for verifying all features work correctly.

## Pre-Testing Setup

1. Ensure both applications are running:
   ```bash
   # Terminal 1
   cd site-1-form
   npm run dev
   
   # Terminal 2
   cd site-2-embedder
   npm run dev
   ```

2. Open Site 2 in your browser: `http://localhost:5174`

## ✅ Core Functionality Tests

### 1. Iframe Embedding
- [ ] Form loads inside Site 2's page
- [ ] No visible iframe borders
- [ ] Form appears native to Site 2
- [ ] Form has rounded corners matching the container
- [ ] Box shadow applied to form container

**Expected**: Form should look like it's part of Site 2, not an embedded element.

---

### 2. Auto-Resize Functionality

#### Test A: Initial Load
- [ ] Open Site 2
- [ ] Observe iframe height adjusts within 1-2 seconds
- [ ] No scrollbars appear inside iframe
- [ ] All form content visible

#### Test B: Content Changes
- [ ] Fill in form fields
- [ ] Observe height stays correct
- [ ] Open browser DevTools > Console
- [ ] Look for `form-height` messages being sent

**Expected**: Iframe should always show full content without scrollbars.

---

### 3. Form Validation

#### Test Each Field:

**Name Field:**
- [ ] Leave empty and submit → Error: "Name is required"
- [ ] Fill with whitespace only → Error should show
- [ ] Enter valid name → Error clears
- [ ] Tab to field and press Enter → Focus works

**Email Field:**
- [ ] Leave empty → Error: "Email is required"
- [ ] Enter "invalid" → Error: "Please enter a valid email"
- [ ] Enter "test@" → Error persists
- [ ] Enter "test@example.com" → Error clears

**Phone Field:**
- [ ] Leave empty → Error: "Phone is required"
- [ ] Enter "123" → Error: "Please enter a valid phone number"
- [ ] Enter "+1 (555) 123-4567" → Error clears
- [ ] Enter letters → Error shows

**Topic Field:**
- [ ] Leave as "Select a topic" → Error: "Please select a topic"
- [ ] Select "General Inquiry" → Error clears

**Message Field:**
- [ ] Leave empty → Error: "Message is required"
- [ ] Type text → Error clears
- [ ] Text area expands as you type

**Subscribe Checkbox:**
- [ ] Checkbox toggles on/off
- [ ] Visual feedback on click
- [ ] No error (optional field)

---

### 4. Form Submission

#### Success Flow:
1. Fill all required fields with valid data
2. Check "Subscribe" checkbox
3. Click "Submit Form" button
4. Observe:
   - [ ] Success screen appears in iframe (green checkmark)
   - [ ] "Thank You!" message displays
   - [ ] Toast notification appears in Site 2 (top-right)
   - [ ] Toast shows submitted name
   - [ ] Toast shows submitted email
   - [ ] Toast shows "Subscribed to newsletter" if checked
   - [ ] Form auto-resets after 3 seconds
   - [ ] Toast auto-dismisses after 8 seconds

#### Test Toast:
- [ ] Click X button on toast → Dismisses immediately
- [ ] Submit form again → New toast appears
- [ ] Toast stays visible for ~8 seconds

**Expected**: Both iframe and parent page show success feedback.

---

### 5. Theme Synchronization

#### Test Light to Dark:
1. Click sun/moon icon in Site 2 header
2. Observe:
   - [ ] Site 2 background changes to dark
   - [ ] Site 2 text colors invert
   - [ ] Form inside iframe also changes to dark
   - [ ] Form inputs have dark backgrounds
   - [ ] Form text is light colored

#### Test Dark to Light:
1. Click icon again
2. Observe:
   - [ ] Both sites return to light theme
   - [ ] Colors sync properly

#### Test Reload:
1. Set dark mode
2. Refresh page (F5)
3. Observe:
   - [ ] Theme persists (from localStorage)
   - [ ] Form receives theme message on load

**Expected**: Theme should stay synchronized between both sites.

---

### 6. Responsive Design

#### Desktop (1920x1080):
- [ ] Form width maxes at ~700px
- [ ] Form centered in container
- [ ] All elements properly spaced

#### Tablet (768x1024):
- [ ] Form scales down appropriately
- [ ] Text remains readable
- [ ] Buttons full width
- [ ] No horizontal scroll

#### Mobile (375x667):
- [ ] Form uses full width minus padding
- [ ] Labels above inputs
- [ ] Touch targets large enough (44px+)
- [ ] Submit button full width
- [ ] Toast notification fits screen

**How to Test**: Use browser DevTools > Toggle Device Toolbar

---

### 7. Loading States

#### Initial Load:
1. Refresh page or open in new tab
2. Observe:
   - [ ] Loading spinner appears
   - [ ] "Loading form..." text displays
   - [ ] Spinner disappears when form loads
   - [ ] Smooth fade-in transition

#### Slow Connection:
1. Open DevTools > Network tab
2. Set throttling to "Slow 3G"
3. Refresh page
4. Observe:
   - [ ] Loading state visible longer
   - [ ] Eventually loads or shows error

---

### 8. Error Handling

#### Timeout Scenario:
To simulate, temporarily change iframe URL to invalid domain:

1. Edit `site-2-embedder/src/App.jsx`:
   ```javascript
   const formUrl = "http://invalid-domain.local/form";
   ```
2. Refresh Site 2
3. Wait 3 seconds
4. Observe:
   - [ ] Yellow warning banner appears
   - [ ] "Having trouble loading the form?" message
   - [ ] "Open in new tab" link present
   - [ ] Default height applied (800px)

5. Click "Open in new tab" link:
   - [ ] Opens in new window (with error, since URL is invalid)

**Reset**: Change URL back to `http://localhost:5173/form`

---

### 9. Accessibility

#### Keyboard Navigation:
1. Click in browser address bar
2. Press Tab repeatedly
3. Observe:
   - [ ] Theme toggle receives focus (visible outline)
   - [ ] Press Tab → Focus enters iframe
   - [ ] Tab through all form fields in order
   - [ ] Visible focus indicators on all fields
   - [ ] Press Enter on submit → Form submits

#### Screen Reader (if available):
- [ ] Form has proper labels
- [ ] Error messages announced
- [ ] Required fields indicated
- [ ] Button labels clear

#### ARIA Attributes:
Open DevTools > Elements, verify:
- [ ] `aria-required="true"` on required fields
- [ ] `aria-invalid` set when errors present
- [ ] `aria-describedby` links to error messages
- [ ] `role="alert"` on error messages

---

### 10. PostMessage Security

#### Check Console Messages:
1. Open DevTools > Console
2. Submit form
3. Look for logs showing:
   - [ ] `form-height` messages with height values
   - [ ] `form-submitted` message with data object
   - [ ] `theme-change` messages when toggling theme

#### Verify Message Structure:
Messages should have this structure:
```javascript
// Height update
{ type: 'form-height', height: 1234 }

// Submission
{ type: 'form-submitted', data: { name, email, ... } }

// Theme change
{ type: 'theme-change', theme: 'dark' }
```

---

## 🚨 Common Issues & Solutions

### Issue: Form not loading
**Solution**: 
- Check both servers are running
- Verify ports 5173 and 5174 are available
- Check browser console for errors

### Issue: Height not adjusting
**Solution**:
- Verify postMessage in console
- Check for JavaScript errors
- Ensure ResizeObserver is supported

### Issue: Theme not syncing
**Solution**:
- Verify iframe has loaded (check DevTools)
- Look for theme-change messages in console
- Check document.documentElement classes

### Issue: Validation not working
**Solution**:
- Check form state in React DevTools
- Verify validation functions exist
- Look for console errors

---

## 📊 Performance Tests

### Load Time:
- [ ] Site 2 loads in < 2 seconds
- [ ] Iframe loads in < 2 seconds
- [ ] No layout shift during load

### Interaction:
- [ ] Typing in fields has no lag
- [ ] Theme toggle is instant
- [ ] Form submission is immediate

### Memory:
- [ ] No memory leaks after multiple submissions
- [ ] Console shows no warnings

---

## 🔍 Cross-Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

All features should work identically.

---

## ✅ Production Readiness Checklist

Before deploying:
- [ ] Replace all `"*"` with specific origins in postMessage
- [ ] Add origin verification in message handlers
- [ ] Update iframe URL to production domain
- [ ] Test with production URLs locally
- [ ] Verify HTTPS works (mixed content warnings)
- [ ] Test on actual mobile devices
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Check accessibility with real screen reader
- [ ] Verify no console errors in production build
- [ ] Test error scenarios (network offline, etc.)

---

## 🎯 Success Criteria

All tests should pass with:
- ✅ No JavaScript errors in console
- ✅ No visual glitches or layout issues
- ✅ Smooth animations and transitions
- ✅ Proper error handling
- ✅ Accessibility compliance
- ✅ Cross-browser compatibility

---

**Testing Time Estimate**: 30-45 minutes for complete testing

**Recommended**: Re-test after any code changes or before deployment.