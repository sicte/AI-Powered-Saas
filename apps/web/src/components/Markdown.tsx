import { useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Copy, Check } from 'lucide-react';

function extractText(node: unknown): string {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  const el = node as { props?: { children?: unknown } };
  if (el.props && el.props.children != null) return extractText(el.props.children);
  return '';
}

function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const code = extractText(children);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-white/10 bg-ink-900/90">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Code</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 text-[10px] font-medium text-white/50 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs font-mono leading-relaxed text-white/85">{children}</pre>
    </div>
  );
}

function Heading({ children, level }: { children: ReactNode; level: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const size = {
    1: 'text-lg mt-4 mb-2',
    2: 'text-base mt-4 mb-2',
    3: 'text-[15px] mt-3 mb-1.5',
    4: 'text-sm mt-3 mb-1.5',
    5: 'text-sm mt-2 mb-1',
    6: 'text-sm mt-2 mb-1',
  }[level];
  return <div className={`${size} font-bold text-white first:mt-0`}>{children}</div>;
}

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="text-sm text-white/80 leading-relaxed [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&_li>p]:my-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          code: ({ children }) => (
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono text-brand-300">
              {children}
            </code>
          ),
          h1: ({ children }) => <Heading level={1}>{children}</Heading>,
          h2: ({ children }) => <Heading level={2}>{children}</Heading>,
          h3: ({ children }) => <Heading level={3}>{children}</Heading>,
          h4: ({ children }) => <Heading level={4}>{children}</Heading>,
          h5: ({ children }) => <Heading level={5}>{children}</Heading>,
          h6: ({ children }) => <Heading level={6}>{children}</Heading>,
          ul: ({ children }) => <ul className="my-2 pl-5 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 pl-5 list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 underline hover:text-brand-300 transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-brand-500 pl-3 text-white/60 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-white/10" />,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-white/5 text-white/80">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-1.5 text-left font-semibold border-b border-white/10">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-1.5 text-white/70 border-b border-white/5">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}