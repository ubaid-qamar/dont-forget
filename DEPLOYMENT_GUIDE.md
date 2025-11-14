# Deployment Guide for Dont-Forget-Tasks

This guide provides multiple deployment options for your React + Vite application.

## Project Overview
- **Framework**: React 19 + Vite
- **Type**: Single Page Application (SPA)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## Option 1: Vercel (Recommended - Already Configured) ⭐

Your project already has a `vercel.json` configuration file, making Vercel the easiest option.

### Method A: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to the PROJECT ROOT directory** (NOT the client subdirectory):
   ```bash
   cd Dont-Forget-Tasks
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production deployment: `vercel --prod`
   - **IMPORTANT**: Deploy from the root `Dont-Forget-Tasks` directory, NOT from the `client` subdirectory

### Method B: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `Dont-Forget-Tasks/client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

---

## Option 2: Netlify

### Method A: Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Navigate to client directory**:
   ```bash
   cd Dont-Forget-Tasks/client
   ```

3. **Build the project**:
   ```bash
   npm install
   npm run build
   ```

4. **Deploy**:
   ```bash
   netlify deploy
   ```
   - For production: `netlify deploy --prod`

### Method B: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - **Base directory**: `Dont-Forget-Tasks/client`
   - **Build command**: `npm run build`
   - **Publish directory**: `Dont-Forget-Tasks/client/dist`
5. Add `_redirects` file in `public` folder:
   ```
   /*    /index.html   200
   ```

---

## Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   cd Dont-Forget-Tasks/client
   npm install --save-dev gh-pages
   ```

2. **Update `package.json`**:
   Add these scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update `vite.config.js`**:
   Add base URL:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     plugins: [react()]
   })
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to repository settings
   - Navigate to "Pages"
   - Select `gh-pages` branch

---

## Option 4: Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Static Site"
3. Connect your Git repository
4. Configure:
   - **Root Directory**: `Dont-Forget-Tasks/client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click "Create Static Site"

---

## Option 5: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (if needed)
5. Configure:
   - **Root Directory**: `Dont-Forget-Tasks/client`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve dist -s -p $PORT`

---

## Option 6: Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Click "Create a project"
3. Connect your Git repository
4. Configure:
   - **Framework preset**: Vite
   - **Root directory**: `Dont-Forget-Tasks/client`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click "Save and Deploy"

---

## Option 7: AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Configure:
   - **App root directory**: `Dont-Forget-Tasks/client`
   - Build settings will auto-detect (Vite)
5. Click "Save and deploy"

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are listed in `package.json`
- [ ] Build command works locally: `npm run build`
- [ ] Preview works locally: `npm run preview`
- [ ] All environment variables are configured (if any)
- [ ] Remove console.logs and debug code
- [ ] Test all routes and functionality
- [ ] Optimize images and assets
- [ ] Update any hardcoded URLs to use environment variables

---

## Build and Test Locally

```bash
# Navigate to client directory
cd Dont-Forget-Tasks/client

# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

The preview will run at `http://localhost:4173` by default.

---

## Common Issues & Solutions

### Issue: Routes not working (404 errors)
**Solution**: Ensure your deployment platform is configured for SPA routing:
- Vercel: ✅ Already configured in `vercel.json`
- Netlify: Add `_redirects` file
- Others: Configure rewrites/redirects

### Issue: Assets not loading
**Solution**: Check the `base` configuration in `vite.config.js` matches your deployment URL

### Issue: Build fails
**Solution**: 
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version compatibility
- Review build logs for specific errors

---

## Recommended Deployment Flow

For the fastest deployment with your current setup:

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel** (easiest):
   ```bash
   cd Dont-Forget-Tasks
   vercel --prod
   ```
   **IMPORTANT**: Make sure you're in the root `Dont-Forget-Tasks` directory, NOT the `client` subdirectory!

Or connect your GitHub repository to Vercel dashboard for automatic deployments on every push. The `vercel.json` configuration file in the root directory will handle the build correctly.

---

## Post-Deployment

After successful deployment:

1. Test all features on the live site
2. Check all routes work correctly
3. Test on different devices/browsers
4. Monitor for any console errors
5. Set up custom domain (optional)
6. Configure SSL/HTTPS (usually automatic)

---

## Environment Variables

If your app requires environment variables:

1. Create `.env` file locally (already in `.gitignore`)
2. Add variables with `VITE_` prefix:
   ```
   VITE_API_URL=https://your-api.com
   ```
3. Access in code: `import.meta.env.VITE_API_URL`
4. Add same variables in deployment platform dashboard

---

## Continuous Deployment

Most platforms support automatic deployment:

1. Connect your Git repository
2. Each push to main branch triggers automatic build
3. Pull requests create preview deployments
4. Failed builds prevent deployment

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Vite Docs: https://vitejs.dev/guide/static-deploy.html

---

**Ready to deploy!** Choose the platform that best fits your needs. Vercel is recommended since you already have the configuration file.
