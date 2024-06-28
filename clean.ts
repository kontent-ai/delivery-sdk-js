import { existsSync, rmSync } from 'fs';
import { yellow } from 'colors';

const paths = ['dist'];
for (const path of paths) {
    if (existsSync(path)) {
        rmSync(path, { recursive: true });
        console.log(`Path '${yellow(path)}' has been deleted`);
    }
}
