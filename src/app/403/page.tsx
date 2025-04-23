// src/app/403/page.tsx
export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">403</h1>
        <p className="mt-4 text-xl">No tienes permiso para ver esta página.</p>
      </div>
    </div>
  );
}
