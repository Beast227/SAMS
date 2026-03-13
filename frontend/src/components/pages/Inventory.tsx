import { useState } from "react";
import { useAssets, useDeleteAsset } from "../../hooks/queries/useAssets";
import { useUpdateAsset } from "../../hooks/queries/useUpdateAsset";
import { Link } from "react-router-dom";
import { Edit2, Eye, Server, Trash2, Activity, X } from "lucide-react";

export default function Inventory() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useAssets(page, 10);
  
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<{ id: string, name: string } | null>(null);
  const [newName, setNewName] = useState("");

  const assets = data?.data || [];
  const totalPage = data?.pagination?.totalPages || 1;
  const totalItems = data?.pagination?.totalItems || 0;
  
  const deleteAssetMutation = useDeleteAsset();
  const updateAssetMutation = useUpdateAsset();

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    return status === 'ONLINE' ?
      'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  };

  const deleteAsset = (asset: any) => {
    if (window.confirm(`Are you sure you want to delete ${asset.name}? This will also delete all associated telemetry and alerts.`)) {
      deleteAssetMutation.mutate(asset.macAddr); // Or asset.id depending on your backend
    }
  };

  const openEditModal = (asset: any) => {
    setEditingAsset({ id: asset.id, name: asset.name });
    setNewName(asset.name);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset && newName.trim()) {
      await updateAssetMutation.mutateAsync({ id: editingAsset.id, name: newName });
      setIsEditModalOpen(false);
      setEditingAsset(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-sans relative">

      {/* Main Container */}
      <div className="w-full bg-(--color-card) border border-(--color-card-border) rounded-2xl shadow-xl overflow-hidden flex flex-col grow">

        {/* Header */}
        <div className="p-6 flex justify-between items-center bg-linear-to-b from(--color-panel)/10 to(--color-panel)/10 border-b border-(--color-card-border)">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Assets Inventory</h2>
            <p className="text-sm text-gray-400 mt-1">Manage and monitor your hardware fleet</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex justify-between flex-col h-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--color-panel) border-b border-(--color-card-border)">
                <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider w-[25%]">Asset Name</th>
                <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider w-[20%]">MAC Address</th>
                <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]">Status</th>
                <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider w-[20%]">Registered</th>
                <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider text-right w-[20%]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--color-card-border)">
              {isPending ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500 text-sm">Loading inventory...</td></tr>
              ) : isError ? (
                <tr><td colSpan={5} className="py-8 text-center text-red-400 text-sm">Failed to load assets.</td></tr>
              ) : assets.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No assets registered yet.</td></tr>
              ) : (
                assets.map((asset: any) => (
                  <tr key={asset.id} className="hover:bg-(--color-panel)/30 transition-colors group">

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-(--color-panel) rounded-lg border border-(--color-card-border)">
                          <Server size={16} className="text-gray-300" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">{asset.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-gray-400 bg-(--color-panel) px-2 py-1 rounded border border-(--color-card-border)">
                        {asset.macAddr}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${getStatusStyle(asset.status)}`}>
                        <Activity size={12} />
                        {asset.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-400">
                      {formatDate(asset.createdAt)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/inventory/${asset.id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                          title="View Telemetry"
                        >
                          <Eye size={16} />
                        </Link>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(asset)}
                          className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
                          title="Edit Asset"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Delete Asset"
                          onClick={() => deleteAsset(asset)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-(--color-card-border) flex items-end justify-between bg-transparent">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="px-4 py-1.5 text-xs font-medium text-gray-300 bg-(--color-panel) border border-(--color-card-border) rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-(--color-card) transition-colors">
              Previous
            </button>
            <span className="text-sm font-medium text-gray-400">
              Page {page} of {totalPage}
            </span>
            <button
              onClick={() => setPage(old => (!totalPage || old === totalPage ? old : old + 1))}
              disabled={page == totalPage}
              className="px-4 py-1.5 text-xs font-medium text-gray-300 bg-(--color-panel) border border-(--color-card-border) rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-(--color-card) transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-(--color-card) border border-(--color-card-border) rounded-xl shadow-2xl w-full max-w-md p-6">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-100">Edit Asset Name</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 bg-(--color-panel) border border-(--color-card-border) rounded-lg text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g., Main Server, Edge Node 1"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-(--color-panel) border border-(--color-card-border) rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateAssetMutation.isPending || !newName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {updateAssetMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}