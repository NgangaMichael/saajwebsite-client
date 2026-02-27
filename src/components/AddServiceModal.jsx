// src/components/AddServiceModal.jsx
export default function AddServiceModal({ newService, handleAddChange, addService, closeAddModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add Service</h3>
        <input
          name="servicename"
          className="form-control mb-3"
          placeholder="Service Name (e.g. Email Portal)"
          value={newService.servicename}
          onChange={handleAddChange}
        />
        <input
          name="servicelink"
          className="form-control mb-3"
          placeholder="Service Link (URL)"
          value={newService.servicelink}
          onChange={handleAddChange}
        />
        <div className="flex justify-end gap-2">
          <button onClick={closeAddModal} className="btn btn-secondary">Cancel</button>
          <button onClick={addService} className="btn btn-success">Save</button>
        </div>
      </div>
    </div>
  );
}