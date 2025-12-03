import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      {...props}
    />
  );
}

interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardSkeleton({ className, ...props }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  className?: string;
}

export function TableSkeleton({ rows = 3, className, ...props }: TableSkeletonProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        className
      )}
      {...props}
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  );
}

interface AvatarSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function AvatarSkeleton({ className, ...props }: AvatarSkeletonProps) {
  return (
    <div
      className={cn(
        "h-10 w-10 rounded-full bg-gray-200",
        className
      )}
      {...props}
    />
  );
}

interface TextSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  className?: string;
}

export function TextSkeleton({ lines = 3, className, ...props }: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}