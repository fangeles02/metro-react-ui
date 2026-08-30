export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="showcase__code">
      <code>{code}</code>
    </pre>
  );
}