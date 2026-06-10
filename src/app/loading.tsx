export default function Loading() {
  return (
    <div className="container-page section-block">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-blush-100" />
        <div className="mx-auto mt-6 h-8 w-64 animate-pulse rounded-2xl bg-blush-100" />
        <div className="mx-auto mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-blush-100" />
      </div>
    </div>
  );
}
