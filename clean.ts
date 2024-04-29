import fs from 'fs';
import Colors from 'colors';

const paths = ['dist'];
for (const path of paths) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
        console.log(`Path '${Colors.yellow(path)}' has been deleted`);
    }
}
