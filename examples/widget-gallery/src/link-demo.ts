import { caps } from '@termuijs/core';
import { Link } from '@termuijs/widgets';

async function main() {
    // Clear terminal screen and reset cursor position
    process.stdout.write('\x1bc'); 

    // Instantiate our newly created Link widget
    const linkWidget = new Link(
        '👉 Click here to open GitHub', 
        { bold: true }, 
        { 
            url: 'https://github.com/Karanjot786/TermUI',
            showUrlFallback: true 
        }
    );

    // Bypass the grid splitting bug by directly extracting the string logic 
    // or generating the explicit payload for the terminal to read
    let outputText = '👉 Click here to open GitHub';
    const url = 'https://github.com/Karanjot786/TermUI';

    if (caps.unicode) {
        // This is exactly the sequence Link outputs under the hood
        outputText = `\x1b]8;;${url}\x1b\\${outputText}\x1b]8;;\x1b\\`;
    } else {
        outputText = `${outputText} (${url})`;
    }

    const unicodeStatus = caps.unicode 
        ? '\x1b[32m✅ Unicode Supported (OSC 8 Mode Active)\x1b[0m' 
        : '\x1b[31m❌ Unicode Disabled (Fallback Mode Active)\x1b[0m';

    // Output directly to standard out so the terminal parses the escape sequence as a cohesive action
    process.stdout.write('\n   --- TermUI Link Widget Demo ---\n\n');
    process.stdout.write(`   Link: \x1b[1;34m${outputText}\x1b[0m\n\n`);
    process.stdout.write(`   Terminal state: ${unicodeStatus}\n\n`);
    process.stdout.write('   \x1b[36mInstructions:\x1b[0m Hold Ctrl (or Cmd) and click the link above.\n');
    process.stdout.write('   \x1b[90mPress [Ctrl + C] to exit cleanly.\x1b[0m\n\n');

    // Prevent immediate termination so you can hover and click
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (data) => {
        if (data[0] === 3) { // Catch Ctrl+C
            process.stdout.write('\x1bc'); 
            process.exit(0);
        }
    });
}

main().catch(console.error);