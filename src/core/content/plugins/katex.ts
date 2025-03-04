import katex from "katex";

export const katexPlugin = {
    name: 'katex',
    stage: 'pre' as const,
    priority: 1,
    async transform (content: string) {
        const res = content.replace(/(\${1,2})((?:.|\n)*?)\1/g, (_, sep, tex) => {
            return '{% html tag="span" %}' + katex.renderToString(tex, {
                displayMode: sep.length === 2,
                output: 'htmlAndMathml',
                throwOnError: false,
            }) + "{% /html %}";
        });

        return res;
    }
}