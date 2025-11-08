export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-bg-base dark:bg-bg-base-dark rounded ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-4 border border-border dark:border-border-dark">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-border dark:border-border-dark">
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-2 w-24" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-2 w-2 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>
    </tr>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} border-2 border-primary/20 dark:border-primary-dark/20 border-t-primary dark:border-t-primary-dark rounded-full animate-spin`}
      />
    </div>
  );
}

