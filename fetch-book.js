const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repos = [
    {
        name: 'Startup Research Handbook',
        url: 'https://github.com/Rajkoli145/startup-research-handbook.git',
        tmpDir: path.join(__dirname, '.tmp_startup_book_repo'),
        destDir: path.join(__dirname, 'content', 'book'),
        subDir: '', // root
        exclude: ['SUMMARY.md', 'README.md'],
        defaultSummary: 'Chapter from the Startup Research Handbook.'
    },
    {
        name: 'The Autonomous Organization Handbook',
        url: 'https://github.com/Rajkoli145/Autonomous-Organization-Handbook.git',
        tmpDir: path.join(__dirname, '.tmp_agent_book_repo'),
        destDir: path.join(__dirname, 'content', 'agent-book'),
        subDir: 'chapters',
        exclude: [],
        defaultSummary: 'Chapter from The Autonomous Organization Handbook.'
    }
];

console.log('🔄 Fetching latest handbooks from GitHub...');

repos.forEach(repo => {
    console.log(`\n📦 Processing: ${repo.name}...`);

    // 1. Clean up temp directory
    if (fs.existsSync(repo.tmpDir)) {
        fs.rmSync(repo.tmpDir, { recursive: true, force: true });
    }

    // 2. Clone repository
    try {
        execSync(`git clone ${repo.url} ${repo.tmpDir}`, { stdio: 'ignore' });
    } catch (error) {
        console.error(`❌ Failed to clone ${repo.name} (${repo.url}).`);
        return;
    }

    // 3. Prepare destination directory
    if (!fs.existsSync(repo.destDir)) {
        fs.mkdirSync(repo.destDir, { recursive: true });
    } else {
        const oldFiles = fs.readdirSync(repo.destDir);
        oldFiles.forEach(f => {
            if (f.endsWith('.mdx')) fs.unlinkSync(path.join(repo.destDir, f));
        });
    }

    // 4. Source folder
    const sourceFolder = repo.subDir ? path.join(repo.tmpDir, repo.subDir) : repo.tmpDir;
    if (!fs.existsSync(sourceFolder)) {
        console.warn(`⚠️ Source folder ${sourceFolder} does not exist.`);
        fs.rmSync(repo.tmpDir, { recursive: true, force: true });
        return;
    }

    const files = fs.readdirSync(sourceFolder).filter(f => f.endsWith('.md') && !repo.exclude.includes(f));

    files.forEach(file => {
        const srcPath = path.join(sourceFolder, file);
        const destPath = path.join(repo.destDir, file.replace('.md', '.mdx'));
        
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // Extract title from first H1 if present
        let title = file.replace('.md', '').replace(/-/g, ' ');
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            title = titleMatch[1].trim();
            content = content.replace(/^#\s+(.+)$/m, '').trim();
        }
        
        // Fix MDX JSX parsing errors (e.g., <10 being parsed as a React component)
        content = content.replace(/<(\d)/g, '&lt;$1');
        
        const frontmatter = `---
title: "${title.replace(/["']/g, '')}"
publishedAt: "${new Date().toISOString().split('T')[0]}"
summary: "${repo.defaultSummary}"
---

`;
        
        fs.writeFileSync(destPath, frontmatter + content);
    });

    // Clean up temp directory
    fs.rmSync(repo.tmpDir, { recursive: true, force: true });

    console.log(`✅ Successfully synced ${files.length} chapters into ${path.relative(__dirname, repo.destDir)}!`);
});

console.log('\n🎉 All handbooks synced successfully!');
