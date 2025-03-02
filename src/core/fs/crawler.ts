import { fdir, Group, GroupOutput } from "fdir";
import { basename } from 'path';

export const crawl = async (path: string, extensions: string[]): Promise<GroupOutput> => {
    return new Promise((resolve, reject) => {

        new fdir()
            .withBasePath()
            .withDirs()
            .withSymlinks({ resolvePaths: false })
            .withRelativePaths()
            .withPathSeparator('/')
            .withErrors()
            .group()
            .glob(`./**/*.{${extensions.join(',')}}`)
            .crawl(path)
            .withCallback((err, groups) => {
                if (err) {
                    reject(err);
                }

                resolve(
                    groups
                    .sort((a, b) => a.directory.length - b.directory.length)
                    .map(group => ({
                        directory: group.directory,
                        dir: group.directory,
                        files: Array.from(group.files
                            .sort((a, b) => basename(a).localeCompare(basename(b)))
                            .reduce((unique, file) => {
                                const baseName = basename(file).split('.')[0];
                                if (!unique.has(baseName)) {
                                    unique.set(baseName, file);
                                }
                                return unique;
                            }, new Map())
                            .values()) as string[]
                    }))
                );
            });
    });
}