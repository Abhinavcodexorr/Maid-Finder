# Vercel Deployment Guide for MaidFinder

This guide will help you deploy your Angular application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free account works)
2. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
3. **Node.js**: Version 18 or higher (Vercel will use this automatically)

## Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended for Beginners)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Log In"
   - Sign in with your GitHub/GitLab/Bitbucket account

3. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your repository (maidfinder-clone)
   - Vercel will auto-detect it's an Angular project

4. **Configure Build Settings** (Vercel should auto-detect these, but verify):
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build` (or `ng build --configuration production`)
   - **Output Directory**: `dist/maidfinder-clone`
   - **Install Command**: `npm install`

5. **Environment Variables** (if needed):
   - Go to Project Settings → Environment Variables
   - Add any API URLs or secrets if required

6. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts:
     - Set up and deploy? **Yes**
     - Which scope? (Select your account)
     - Link to existing project? **No** (for first deployment)
     - Project name? (Press Enter for default or type custom name)
     - Directory? (Press Enter for current directory)
     - Override settings? **No**

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Configuration Files

The project includes a `vercel.json` file with the following configuration:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/maidfinder-clone`
- **Rewrites**: All routes redirect to `index.html` (for Angular routing)
- **Headers**: Cache control for static assets

## Post-Deployment

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables

If you need to change API URLs or add secrets:

1. Go to Project Settings → Environment Variables
2. Add variables:
   - `API_URL` (if you want to override environment files)
   - Any other environment-specific variables

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` or `master` branch
- **Preview**: Every push to other branches (creates preview URLs)

## Troubleshooting

### Build Fails

1. **Check Build Logs**: Go to your project → Deployments → Click on failed deployment
2. **Common Issues**:
   - Node version mismatch: Add `.nvmrc` file with Node version
   - Missing dependencies: Ensure `package.json` has all dependencies
   - Build errors: Check Angular build locally first with `npm run build`

### Routing Issues (404 on refresh)

- The `vercel.json` file includes rewrites to handle Angular routing
- If routes still don't work, verify the `rewrites` section in `vercel.json`

### API Connection Issues

- Check CORS settings on your backend API
- Verify API URL in `src/environments/environment.prod.ts`
- Ensure API is accessible from Vercel's servers

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel remove
```

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## Notes

- Your app will be available at: `https://your-project-name.vercel.app`
- Each deployment gets a unique URL
- Production deployments are permanent
- Preview deployments are temporary (for testing)

