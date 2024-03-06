const fs = require('fs');
const colors = require('colors');

const paths = ['dist'];
for (const path of paths) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
        console.log(`Path '${colors.yellow(path)}' has been deleted`);
    }
}
