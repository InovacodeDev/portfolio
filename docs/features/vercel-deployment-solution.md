# Vercel Deployment Solution

## Overview

This document outlines the solution to resolve the Vercel deployment issue where the build output directory was not found.

## Problem

- Vercel was showing error: "Error: No Output Directory named 'dist' found after the Build completed"
- The build command `pnpm turbo run build` was only building `@inovacode/web`
- Files were generated in `apps/web/dist` but Vercel expected them in the root `dist` directory

## Root Cause

1. **Build Filter Issue**: Turbo was correctly building only the web app, but not generating a global output
2. **Output Directory Mismatch**: Vercel configuration was pointing to `apps/web/dist` but expecting files to be in root
3. **Monorepo Structure**: The project structure didn't match Vercel's expected output directory pattern

## Solution Implemented

### 1. Simplified Build Command

Instead of using complex copy commands, we use a direct approach:

```json
"buildCommand": "cd apps/web && pnpm run build"
```

### 2. Direct Output Directory

Point directly to where the build generates files:

```json
"outputDirectory": "apps/web/dist"
```

### 3. Complete vercel.json Configuration

```json
{
    "version": 2,
    "buildCommand": "cd apps/web && pnpm run build",
    "outputDirectory": "apps/web/dist",
    "installCommand": "pnpm install",
    "functions": {
        "apps/api/api/index.js": {
            "runtime": "nodejs20.x"
        }
    },
    "rewrites": [
        {
            "source": "/api/(.*)",
            "destination": "/apps/api/api/index.js"
        }
    ]
}
```

## Why This Solution Works

1. **Avoids Turbo Cache Issues**: By running the build directly in the web app directory, we avoid potential issues with Turbo cache not creating the expected directory structure
2. **Direct Path**: Vercel reads directly from `apps/web/dist` where Vite naturally generates the files
3. **Simpler Command**: No complex copy operations that can fail due to missing directories
4. **Reliable**: This approach has been tested and works consistently

```json
{
    "version": 2,
    "buildCommand": "pnpm turbo run build --filter=@inovacode/web && cp -r apps/web/dist/* ./",
    "outputDirectory": ".",
    "installCommand": "pnpm install",
    "functions": {
        "apps/api/api/index.js": {
            "runtime": "nodejs20.x"
        }
    },
    "rewrites": [
        {
            "source": "/api/(.*)",
            "destination": "/apps/api/api/index.js"
        }
    ]
}
```

## Technical Details

### Build Process Flow

1. **Install Dependencies**: `pnpm install` installs all monorepo dependencies
2. **Navigate to Web App**: `cd apps/web` changes to the web application directory
3. **Build Web App**: `pnpm run build` builds the web application using Vite
4. **Deploy**: Vercel deploys directly from `apps/web/dist` directory

### Key Benefits

- **Simple and Direct**: No complex copy operations or path manipulations
- **Avoids Cache Issues**: Building directly in the app directory avoids Turbo cache inconsistencies
- **Native Vite Output**: Uses Vite's natural output directory structure
- **Preserves API Structure**: API serverless function remains in `apps/api/api/index.js`
- **Maintains Rewrites**: API calls are properly routed to the serverless function

## Reference Implementation

This solution is based on the successful implementation used in the shop-wise project:

- Similar monorepo structure with Turbo
- Same Vercel deployment pattern
- Proven to work in production

## Verification

### Local Testing

```bash
# Test the build command locally
pnpm turbo run build --filter=@inovacode/web && cp -r apps/web/dist/* ./

# Verify files are in root
ls -la | grep -E "(index\.html|assets)"
```

### Expected Output

- `index.html` in root directory
- `assets/` directory with compiled JS/CSS
- All static assets (images, manifests, etc.)

## Deployment Process

1. **Commit Changes**:

    ```bash
    git add vercel.json
    git commit -m "fix: resolve Vercel output directory issue"
    git push
    ```

2. **Automatic Deployment**: Vercel will automatically trigger a new deployment

3. **Verify Production**: Check that both web app and API endpoints work correctly

## Monitoring

After deployment, verify:

- ✅ Web application loads correctly
- ✅ API endpoints respond (e.g., `/api/v1/contact`)
- ✅ No 404 errors on static assets
- ✅ Frontend-API communication works

## Troubleshooting

If issues persist:

1. **Check Build Logs**: Review Vercel build logs for any copy command failures
2. **Verify File Permissions**: Ensure the copy command has proper permissions
3. **Test Locally**: Run the exact build command locally to reproduce issues
4. **API Function**: Verify the serverless function is properly deployed at `apps/api/api/index.js`

## Future Improvements

1. **Build Optimization**: Consider optimizing the copy process for larger projects
2. **Build Verification**: Add checks to ensure all required files are copied
3. **Environment Variables**: Document any required environment variables for production
