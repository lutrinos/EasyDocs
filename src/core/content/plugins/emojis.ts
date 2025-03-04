import data from "./emojis-data";

export const emojisPlugin = {
    name: "emojis",
    stage: "pre" as const,
    priority: 1,
    transform(content: string) {
        return content.replace(/:([0-9a-zA-Z_-]+?):/g, (match, code) => {
            if (data[code]) {
                return data[code];
            }
            return match;
        });
    }
}