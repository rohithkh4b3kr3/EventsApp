export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
