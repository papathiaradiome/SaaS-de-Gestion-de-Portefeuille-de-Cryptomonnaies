export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-base-800/60 ${className}`} />;
}

export function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return <Skeleton className="h-80" />;
}
