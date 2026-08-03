export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

export function BookCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-[180px] flex-shrink-0 rounded-lg bg-white p-4 shadow-sm">
          <SkeletonBox className="mb-4 h-[180px] w-full" />
          <SkeletonBox className="mb-2 h-4 w-3/4" />
          <SkeletonBox className="mb-2 h-3 w-1/2" />
          <SkeletonBox className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function SelectedBookSkeleton() {
  return (
    <section className="max-w-[1070px] mx-auto px-6 py-10">
      <SkeletonBox className="mb-6 h-7 w-48" />
      <div className="flex w-full max-w-3xl gap-4 rounded-lg bg-[#fbefd6] p-5">
        <div className="flex-1 space-y-3">
          <SkeletonBox className="h-5 w-3/4" />
          <SkeletonBox className="h-4 w-1/2" />
          <SkeletonBox className="h-10 w-32 rounded" />
        </div>
        <SkeletonBox className="h-[140px] w-[140px] rounded-md" />
      </div>
    </section>
  );
}

export function SearchResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded border border-gray-100 px-4 py-3">
          <SkeletonBox className="h-16 w-16 rounded-md" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
            <SkeletonBox className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="max-w-[1070px] mx-auto px-8 py-10 space-y-12">
      <SkeletonBox className="h-9 w-48" />
      <div className="space-y-4 border-b border-gray-300 pb-6">
        <SkeletonBox className="h-6 w-48" />
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-10 w-40 rounded-md" />
      </div>
      <div className="space-y-4">
        <SkeletonBox className="h-6 w-32" />
        <SkeletonBox className="h-5 w-56" />
      </div>
    </div>
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="flex gap-8 bg-white p-8">
      <div className="w-3/4 space-y-4">
        <SkeletonBox className="h-8 w-2/3" />
        <SkeletonBox className="h-5 w-1/3" />
        <SkeletonBox className="h-5 w-2/3" />
        <div className="flex gap-4 pt-2">
          <SkeletonBox className="h-5 w-32" />
          <SkeletonBox className="h-5 w-32" />
        </div>
        <div className="flex gap-4 pt-2">
          <SkeletonBox className="h-5 w-32" />
          <SkeletonBox className="h-5 w-32" />
        </div>
        <div className="flex gap-4 pt-4">
          <SkeletonBox className="h-12 w-32 rounded" />
          <SkeletonBox className="h-12 w-32 rounded" />
        </div>
        <SkeletonBox className="h-5 w-full" />
        <SkeletonBox className="h-5 w-full" />
        <SkeletonBox className="h-5 w-3/4" />
      </div>
      <div className="w-[300px]">
        <SkeletonBox className="h-[300px] w-full" />
      </div>
    </div>
  );
}
