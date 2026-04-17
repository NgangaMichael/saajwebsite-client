// src/components/AddServiceModal.jsx
export default function AddServiceModal({ newService, handleAddChange, handleFileChange, addService, closeAddModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add Service</h3>
        
        <input
          name="servicename"
          className="form-control mb-3"
          placeholder="Service Name"
          value={newService.servicename}
          onChange={handleAddChange}
        />
        
        <textarea
          name="description"
          className="form-control mb-3"
          placeholder="Description"
          value={newService.description}
          onChange={handleAddChange}
        />

        <div className="border p-3 rounded mb-3 bg-light">
          <label className="block mb-1 font-bold text-sm">Service Content</label>
          <input
            name="servicelink"
            className="form-control mb-2"
            placeholder="Enter URL (leave empty if uploading file)"
            value={newService.servicelink}
            onChange={handleAddChange}
            disabled={newService.file} // Disable if a file is selected
          />
          <div className="text-center text-muted my-1 small">OR</div>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={newService.servicelink.length > 0} // Disable if link is entered
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={closeAddModal} className="btn btn-secondary">Cancel</button>
          <button onClick={addService} className="btn btn-success">Save</button>
        </div>
      </div>
    </div>
  );
}