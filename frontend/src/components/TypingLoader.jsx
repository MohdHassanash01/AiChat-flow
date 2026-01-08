export function TypingLoader() {
  return (
    <div className="flex items-center gap-1 text-green-600 font-medium">
      AI is typing
      <span className="animate-pulse">.</span>
      <span className="animate-pulse delay-150">.</span>
      <span className="animate-pulse delay-300">.</span>
    </div>
  );
}
