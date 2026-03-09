import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertTriangle size={64} className="text-red-500" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        The system couldn't find the resource you requested. It might have been moved,
        deleted, or the Asset ID might be incorrect.
      </p>

      <Link
        to="/dashboard"
        className="flex items-center gap-2 bg-[--color-primary] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        <Home size={20} />
        Back to Dashboard
      </Link>
    </div>
  );
}