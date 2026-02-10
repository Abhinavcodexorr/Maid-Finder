# Deploy to Vercel via Dashboard (Step-by-Step)

Since CLI deployment has permission issues, let's deploy via Vercel Dashboard.

## Method 1: Connect GitHub Repository (Recommended)

### Step 1: Grant Vercel Access from ritesh03 GitHub Account

1. **Login to GitHub as `ritesh03`**
   - Go to: https://github.com/login
   - Make sure you're logged in as `ritesh03`

2. **Go to GitHub Applications**
   - Visit: https://github.com/settings/applications
   - Or: GitHub → Settings → Applications → Authorized OAuth Apps

3. **Find and Configure Vercel**
   - Find "Vercel" in the list
   - Click on it
   - Under "Repository access"
   - Select "All repositories" OR select "Only select repositories" and check `maidFinder`
   - Click "Save" or "Update"

### Step 2: Connect Repository in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/abhinavs-projects-016e8d4c/maidfinder/settings/git

2. **Connect Git Repository**
   - Click "Connect Git Repository"
   - You should now see `ritesh03/maidFinder`
   - Select it
   - Click "Connect"

3. **Wait for Deployment**
   - Vercel will automatically deploy
   - Check status at: https://vercel.com/abhinavs-projects-016e8d4c/maidfinder/deployments

---

## Method 2: Manual Import (If Method 1 Doesn't Work)

### Step 1: Create New Project

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new

2. **Import Git Repository**
   - Click "Import Git Repository"
   - Select GitHub
   - Search for `maidFinder` or `ritesh03/maidFinder`
   - If it appears, click "Import"

### Step 2: Configure Project Settings

1. **Project Name**: `maidfinder` (or leave default)

2. **Framework Preset**: Angular (should auto-detect)

3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/maidfinder-clone`
   - **Install Command**: `npm install`
   - **Root Directory**: `./` (leave default)

4. **Environment Variables**: (Leave empty for now)

5. **Click "Deploy"**

### Step 3: Wait for Deployment

- Build will take 1-3 minutes
- Watch the build logs in real-time
- Once complete, your site will be live!

---

## Method 3: Deploy Existing Project (Redeploy)

If the project already exists:

1. **Go to Deployments**
   - Visit: https://vercel.com/abhinavs-projects-016e8d4c/maidfinder/deployments

2. **Redeploy Latest**
   - Find the latest deployment
   - Click "..." (three dots)
   - Click "Redeploy"
   - Wait for completion

---

## After Deployment

✅ **Your site will be live at**: https://maidfinder.vercel.app

✅ **Future updates**: Once GitHub is connected, every push will auto-deploy!

---

## Quick Links

- **Vercel Project**: https://vercel.com/abhinavs-projects-016e8d4c/maidfinder
- **GitHub Applications**: https://github.com/settings/applications
- **GitHub Repository**: https://github.com/ritesh03/maidFinder

---

**Recommended**: Use Method 1 - it's the cleanest solution and enables auto-deployments!

