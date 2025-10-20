const fs = require('fs');
const path = require('path');

// Directories to process (excluding music commands which keep embeds)
const commandDirs = [
    'src/commands/moderation',
    'src/commands/security',
    'src/commands/admin',
    'src/commands/utility'
];

function convertFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Skip if already using Messages
    if (content.includes("require('../../utils/messages')") || content.includes('require("../../utils/messages")')) {
        console.log(`Skipping ${filePath} - already converted`);
        return;
    }

    // Replace CustomEmbedBuilder import with Messages
    if (content.includes('CustomEmbedBuilder')) {
        content = content.replace(
            /const CustomEmbedBuilder = require\(['"].*embedBuilder['"]\);/g,
            "const Messages = require('../../utils/messages');"
        );
        modified = true;
    }

    // Convert embed replies to simple messages
    // Pattern: embeds: [CustomEmbedBuilder.success('Title', 'Message')]
    content = content.replace(
        /embeds:\s*\[CustomEmbedBuilder\.success\(['"](.*?)['"],\s*[`'"](.+?)[`'"]\)\]/gs,
        (match, title, message) => {
            return `content: Messages.success(\`${message}\`)`;
        }
    );

    content = content.replace(
        /embeds:\s*\[CustomEmbedBuilder\.error\(['"](.*?)['"],\s*[`'"](.+?)[`'"]\)\]/gs,
        (match, title, message) => {
            return `content: Messages.error(\`${message}\`)`;
        }
    );

    content = content.replace(
        /embeds:\s*\[CustomEmbedBuilder\.warning\(['"](.*?)['"],\s*[`'"](.+?)[`'"]\)\]/gs,
        (match, title, message) => {
            return `content: Messages.warning(\`${message}\`)`;
        }
    );

    content = content.replace(
        /embeds:\s*\[CustomEmbedBuilder\.info\(['"](.*?)['"],\s*[`'"](.+?)[`'"]\)\]/gs,
        (match, title, message) => {
            return `content: Messages.info(\`${message}\`)`;
        }
    );

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Converted ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.js')) {
            try {
                convertFile(filePath);
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error.message);
            }
        }
    }
}

console.log('Converting commands to use simple messages...\n');

for (const dir of commandDirs) {
    if (fs.existsSync(dir)) {
        console.log(`\nProcessing ${dir}...`);
        processDirectory(dir);
    }
}

console.log('\n✓ Conversion complete!');
console.log('\nNote: Music commands were not modified and will keep their embeds.');
console.log('Please review the changes and test the bot.');
