export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-(--color-background) animate-pulse">
      {/* Fake Sidebar */}
      <div className="w-64 bg-(--color-card) border-r border-(--color-card-border) hidden md:block" />

      <div className="flex-1 flex flex-col">
        {/* Fake Header */}
        <div className="h-16 border-b border-(--color-card-border) bg-(--color-card) flex items-center px-6 justify-between">
          <div className="h-4 w-32 bg-gray-700/20 rounded-md" />
          <div className="h-9 w-9 bg-gray-700/20 rounded-full" />
        </div>

        {/* Fake Content Area */}
        <main className="p-6 space-y-6">
          <div className="h-8 w-48 bg-gray-700/10 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-700/5 rounded-2xl border border-(--color-card-border)" />
            <div className="h-32 bg-gray-700/5 rounded-2xl border border-(--color-card-border)" />
            <div className="h-32 bg-gray-700/5 rounded-2xl border border-(--color-card-border)" />
          </div>
          <div className="h-64 w-full bg-gray-700/5 rounded-2xl border border-(--color-card-border)" />
        </main>
      </div>
    </div>
  );
}