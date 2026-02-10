# Step-by-Step Guide: Deploy MaidFinder to Vercel

## Prerequisites
- ✅ Code is pushed to GitHub: `https://github.com/Abhinavcodexorr/Maid-Finder.git`
- ✅ Vercel account (free account works)
- ✅ GitHub account connected to Vercel

---

## Method 1: Deploy via Vercel Dashboard (Recommended - Easiest)

### Step 1: Go to Vercel Dashboard
1. Visit: **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with your GitHub account (use the same account: `Abhinavcodexorr`)

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"Maid-Finder"** in the list
4. Click **"Import"** next to it

### Step 3: Configure Project Settings
Vercel should auto-detect Angular, but verify these settings:

**Framework Preset:** Angular (should be auto-detected)

**Build Settings:**
- **Root Directory:** `./` (leave default)
- **Build Command:** `npm run build` (should be auto-filled)
- **Output Directory:** `dist/maidfinder-clone` (should be auto-filled)
- **Install Command:** `npm install` (should be auto-filled)

**Environment Variables:** (Leave empty for now - add later if needed)

### Step 4: Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes for the build to complete
3. Watch the build logs in real-time
4. Once complete, your site will be live!

### Step 5: Access Your Live Site
- Your site will be available at: `https://maidfinder-xxxxx.vercel.app`
- Or a custom domain if you set one up

---

## Method 2: Deploy via Vercel CLI (Alternative)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
- This will open your browser for authentication
- Sign in with your GitHub account

### Step 3: Deploy
```bash
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (for first deployment)
- Project name? (Press Enter for default: `maid-finder`)
- Directory? (Press Enter for current directory)
- Override settings? **No**

### Step 4: Wait for Deployment
- Build will take 2-3 minutes
- Your site will be live once complete!

---

## After Deployment

### Automatic Deployments
✅ **Every push to `main` branch** will automatically trigger a new deployment
✅ **Preview deployments** are created for other branches
✅ **No manual deployment needed** after initial setup!

### Check Deployment Status
- Go to: **https://vercel.com/dashboard**
- Click on your **Maid-Finder** project
- View all deployments in the **"Deployments"** tab

### View Build Logs
- Click on any deployment
- View **"Build Logs"** to see what happened during build

---

## Troubleshooting

### Issue: Repository Not Showing in Vercel
**Solution:**
1. Go to: **https://github.com/settings/applications**
2. Find **"Vercel"** → Click **"Configure"**
3. Under **"Repository access"**, select **"All repositories"** or select `Maid-Finder`
4. Save changes
5. Go back to Vercel and try importing again

### Issue: Build Fails
**Solution:**
1. Check build logs in Vercel dashboard
2. Common issues:
   - Node version mismatch → Add `.nvmrc` file with Node version
   - Missing dependencies → Ensure `package.json` has all dependencies
   - Build errors → Test build locally first: `npm run build`

### Issue: Routing Not Working (404 on refresh)
**Solution:**
- The `vercel.json` file already includes rewrites for Angular routing
- If still not working, verify `vercel.json` has the rewrites section

### Issue: Environment Variables Needed
**Solution:**
1. Go to Project Settings → Environment Variables
2. Add variables:
   - `API_URL` (if different from default)
   - Any other environment-specific variables
3. Redeploy after adding variables

---

## Project Configuration Files

Your project already includes:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `package.json` - Build scripts configured

---

## Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/Abhinavcodexorr/Maid-Finder
- **Vercel Documentation:** https://vercel.com/docs

---

## Summary

**Easiest Method:**
1. Go to **vercel.com** → Sign in with GitHub
2. Click **"Add New Project"**
3. Import **"Maid-Finder"** repository
4. Click **"Deploy"**
5. Wait 2-3 minutes
6. **Done!** 🎉

Your site will be live and automatically deploy on every GitHub push!
