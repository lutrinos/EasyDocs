import copy from 'copy-to-clipboard';
import { useEffect, useRef, useState } from 'preact/hooks';
import { ClipboardCheck, Copy, File } from 'lucide-preact';


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
            <div className="code-bar">
                <div>
                    <File size={16} />
                    <span>main.js</span>
                </div>
                <button onClick={() => setCopied(true)}>
                    {
                        copied
                            ? <ClipboardCheck  size={16} />
                            : <Copy size={16} />
                    }
                </button>
            </div>
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
        </div>
    );
}