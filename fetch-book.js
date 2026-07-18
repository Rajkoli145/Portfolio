const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoUrl = 'https://github.com/Rajkoli145/startup-research-handbook.git';
const tmpDir = path.join(__dirname, '.tmp_book_repo');
const destDir = path.join(__dirname, 'content', 'book');

console.log('🔄 Fetching latest chapters from GitHub...');

// 1. Clean up any previous temp directories
if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
}

// 2. Clone the repository
try {
    execSync(`git clone ${repoUrl} ${tmpDir}`, { stdio: 'ignore' });
} catch (error) {
    console.error('❌ Failed to clone the repository. Check your internet connection or repository URL.');
    process.exit(1);
}

// 3. Prepare destination directory
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
} else {
    // Clear out old mdx files
    const oldFiles = fs.readdirSync(destDir);
    oldFiles.forEach(f => {
        if (f.endsWith('.mdx')) fs.unlinkSync(path.join(destDir, f));
    });
}

// 4. Process the markdown files
const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.md') && f !== 'SUMMARY.md' && f !== 'README.md');

files.forEach(file => {
    const srcPath = path.join(tmpDir, file);
    const destPath = path.join(destDir, file.replace('.md', '.mdx'));
    
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Extract title from first H1 if present
    let title = file.replace('.md', '').replace(/-/g, ' ');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
        title = titleMatch[1].trim();
        // Remove the H1 from content since it will be rendered by the page layout
        content = content.replace(/^#\s+(.+)$/m, '').trim();
    }
    
    // Fix MDX JSX parsing errors (e.g., <10 being parsed as a React component)
    content = content.replace(/<(\d)/g, '&lt;$1');
    
    const frontmatter = `---
title: "${title.replace(/["']/g, '')}"
publishedAt: "${new Date().toISOString().split('T')[0]}"
summary: "Chapter from the Startup Research Handbook."
---

`;
    
    fs.writeFileSync(destPath, frontmatter + content);
});

// 5. Clean up temp directory
fs.rmSync(tmpDir, { recursive: true, force: true });

console.log(`✅ Successfully synced ${files.length} chapters into content/book!`);
