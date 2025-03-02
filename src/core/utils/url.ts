/*import { basename, extname } from 'path';
import { MARKDOWN_EXTENSIONS } from '../constants';

export function generateUrl(base: string = '/', url: string): string {
    const filename = basename(filePath);
    const isIndex = MARKDOWN_EXTENSIONS.some(ext => 
        filename === `index.${ext}`
    );

    if (isIndex && groupUrl) {
        return groupUrl;
    }

    const nameWithoutExt = filename.replace(
        new RegExp(`\\.(${MARKDOWN_EXTENSIONS.join('|')})$`), 
        ''
    );

    if (!groupUrl) {
        return `/${nameWithoutExt}`;
    }

    return `${groupUrl}/${nameWithoutExt}`;
}*/