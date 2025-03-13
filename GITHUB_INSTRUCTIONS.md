# GitHub Deployment Instructions

1. Create a new repository on GitHub (https://github.com/new)
   - Name the repository (e.g., "yale-intake-form")
   - Add a description (optional)
   - Choose public or private visibility
   - Click "Create repository"

2. Link your local repository to GitHub and push your code:
   ```bash
   # Navigate to your project folder
   cd /Users/franzhartl/Desktop/yale-intake-form
   
   # Add the remote repository (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/yale-intake-form.git
   
   # Push your code to GitHub
   git push -u origin master
   ```

3. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "GitHub Pages" section
   - Select "master branch" as the source
   - Click "Save"
   - Your site will be published at https://YOUR_USERNAME.github.io/yale-intake-form/

Once deployed, your work intake form will be accessible via the GitHub Pages URL.