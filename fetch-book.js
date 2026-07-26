const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repos = [
    {
        name: 'Startup Research Handbook',
        url: 'https://github.com/Rajkoli145/startup-research-handbook.git',
        tmpDir: path.join(__dirname, '.tmp_startup_book_repo'),
        sources: [
            {
                subDir: '',
                destDir: path.join(__dirname, 'content', 'book'),
                exclude: ['SUMMARY.md', 'README.md'],
                defaultSummary: 'Chapter from the Startup Research Handbook.'
            }
        ]
    },
    {
        name: 'The Autonomous Organization Handbook',
        url: 'https://github.com/Rajkoli145/Autonomous-Organization-Handbook.git',
        tmpDir: path.join(__dirname, '.tmp_agent_book_repo'),
        sources: [
            {
                subDir: 'chapters',
                destDir: path.join(__dirname, 'content', 'agent-book'),
                exclude: [],
                defaultSummary: 'Chapter from The Autonomous Organization Handbook.'
            },
            {
                subDir: 'research-notes',
                destDir: path.join(__dirname, 'content', 'agent-notes'),
                exclude: ['README.md'],
                defaultSummary: 'Research notes, hypotheses, and analytical commentary.'
            }
        ]
    }
];

function getMarkdownFiles(dirPath, arrayOfFiles = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getMarkdownFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.md')) {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

console.log('🔄 Fetching latest handbooks and research notes from GitHub...');

repos.forEach(repo => {
    console.log(`\n📦 Processing: ${repo.name}...`);

    // 1. Clean up temp directory
    if (fs.existsSync(repo.tmpDir)) {
        fs.rmSync(repo.tmpDir, { recursive: true, force: true });
    }

    // 2. Clone repository
    try {
        const token = process.env.GITHUB_TOKEN;
        const cloneUrl = token ? repo.url.replace('https://', `https://${token}@`) : repo.url;
        execSync(`git clone ${cloneUrl} ${repo.tmpDir}`, { stdio: 'ignore' });
    } catch (error) {
        console.error(`❌ Failed to clone ${repo.name} (${repo.url}).`);
        return;
    }

    // 3. Process each source configuration
    repo.sources.forEach(source => {
        // Prepare destination directory
        if (!fs.existsSync(source.destDir)) {
            fs.mkdirSync(source.destDir, { recursive: true });
        } else {
            const oldFiles = fs.readdirSync(source.destDir);
            oldFiles.forEach(f => {
                if (f.endsWith('.mdx')) fs.unlinkSync(path.join(source.destDir, f));
            });
        }

        const sourceFolder = source.subDir ? path.join(repo.tmpDir, source.subDir) : repo.tmpDir;
        if (!fs.existsSync(sourceFolder)) {
            console.warn(`⚠️ Source folder ${sourceFolder} does not exist in ${repo.name}.`);
            return;
        }

        const mdFiles = getMarkdownFiles(sourceFolder).filter(filePath => {
            const fileName = path.basename(filePath);
            return !source.exclude.includes(fileName);
        });

        mdFiles.forEach(srcPath => {
            const relativePath = path.relative(sourceFolder, srcPath);
            // Replace path slashes with hyphen for filename to flatten or keep structure
            const targetFileName = relativePath.replace(/[\/\\]/g, '-').replace('.md', '.mdx');
            const destPath = path.join(source.destDir, targetFileName);

            let content = fs.readFileSync(srcPath, 'utf8');

            // Extract title from first H1 if present
            let title = path.basename(srcPath, '.md').replace(/-/g, ' ');
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
summary: "${source.defaultSummary}"
---

`;

            fs.writeFileSync(destPath, frontmatter + content);
        });

        console.log(`  ✅ Synced ${mdFiles.length} files into ${path.relative(__dirname, source.destDir)}`);
    });

    // Clean up temp directory
    fs.rmSync(repo.tmpDir, { recursive: true, force: true });
});

console.log('\n🎉 All handbooks and research notes synced successfully!');
