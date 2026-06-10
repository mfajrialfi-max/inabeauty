export default function ProductsLoading() {
  return (
    <div className="container-page section-block">
      <div className="h-6 w-28 rounded-full bg-blush-100" />
      <div className="mt-3 h-10 w-64 rounded-2xl bg-blush-100" />
      <div className="mt-8 h-20 rounded-[8px] bg-white shadow-soft" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-96 animate-pulse rounded-[8px] bg-white shadow-soft" />
        ))}
      </div>
    </div>
  );
}
