import { deleteFolderRecursive } from "@kontent-ai/core-sdk/devkit";

for (const path of ["dist", "bundles"]) {
	deleteFolderRecursive(path);
}
