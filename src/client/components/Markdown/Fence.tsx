import copy from 'copy-to-clipboard';
import { useEffect, useRef, useState } from 'preact/hooks';
import { ClipboardCheck, Copy } from 'lucide-preact';


export function Fence({ language, html }: any) {
    const [copied, setCopied] = useState(false);
    const ref = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (copied) {
            // @ts-ignore
            copy(ref.current?.innerText);
            const to = setTimeout(setCopied, 1000, false);
            return () => clearTimeout(to);
        }
    }, [copied]);

    return (
        <div className="code" aria-live="polite">
            <pre
                className={`language-${language ?? ''}`}
                ref={ref}
            >
                <code
                    className={`language-${language ?? ''}`}
                    dangerouslySetInnerHTML={{
                        __html: html
                    }} />
            </pre>
            <button onClick={() => setCopied(true)}>
                {
                    copied
                        ? <ClipboardCheck />
                        : <Copy />
                }
            </button>
        </div>
    );
}