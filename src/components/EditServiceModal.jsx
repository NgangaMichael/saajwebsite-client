// src/components/EditServiceModal.jsx
export default function EditServiceModal({ formData, handleEditChange, saveService, closeEditModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Edit Service</h3>
        <label className="small">Service Name</label>
        <input
          name="servicename"
          className="form-control mb-3"
          value={formData.servicename}
          onChange={handleEditChange}
        />
        <label className="small">Description</label>
        <input
          name="description"
          className="form-control mb-3"
          value={formData.description}
          onChange={handleEditChange}
        />
        <label className="small">Service Link</label>
        <input
          name="servicelink"
          className="form-control mb-3"
          value={formData.servicelink}
          onChange={handleEditChange}
        />
        <div className="flex justify-end gap-2">
          <button onClick={closeEditModal} className="btn btn-secondary">Cancel</button>
          <button onClick={saveService} className="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  );
}