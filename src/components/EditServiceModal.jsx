// src/components/EditServiceModal.jsx
export default function EditServiceModal({ formData, handleEditChange, handleFileChange, saveService, closeEditModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Edit Service</h3>
        
        <label className="small font-bold">Service Name</label>
        <input
          name="servicename"
          className="form-control mb-3"
          value={formData.servicename}
          onChange={handleEditChange}
        />
        
        <label className="small font-bold">Description</label>
        <textarea
          name="description"
          className="form-control mb-3"
          value={formData.description}
          onChange={handleEditChange}
        />

        <div className="border p-3 rounded mb-3 bg-light">
          <label className="block mb-1 font-bold text-sm">Update Content</label>
          <input
            name="servicelink"
            className="form-control mb-2"
            placeholder="URL (e.g. https://google.com)"
            value={formData.servicelink}
            onChange={handleEditChange}
            disabled={formData.file} 
          />
          <div className="text-center text-muted my-1 small">OR</div>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={formData.servicelink?.length > 0}
          />
          {/* Helpful hint for existing files */}
          {!formData.file && !/^https?:\/\//i.test(formData.servicelink) && formData.servicelink && (
             <p className="text-xs text-blue-600 mt-1">Current: Document attached</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={closeEditModal} className="btn btn-secondary">Cancel</button>
          <button onClick={saveService} className="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  );
}