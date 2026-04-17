// src/pages/Services.jsx
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, ExternalLink, Plus } from "lucide-react";
import {
  getServices,
  addService as apiAddService,
  updateService,
  deleteService as apiDeleteService,
} from "../services/service";
import api from "../services/api";
import AddServiceModal from "../components/AddServiceModal";
import EditServiceModal from "../components/EditServiceModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [adding, setAdding] = useState(false);
  const [newService, setNewService] = useState({
    servicename: "",
    description: "",
    servicelink: "",
    file: null, // New state for file
  });

  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    servicename: "",
    description: "",
    servicelink: "",
  });

  const fetchServices = async () => {
    try {
      const data = await getServices();
      const servicesList = data.data;
      setServices(servicesList);

      // ✅ Mark all services as seen
      if (storedUser?.id) {
        localStorage.setItem(`seen_services_count_${storedUser.id}`, servicesList.length);
        // Trigger storage event so the Sidebar updates immediately
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleFileChange = (e) => {
    setNewService((prev) => ({ ...prev, file: e.target.files[0], servicelink: "" }));
  };

  const handleEditFileChange = (e) => {
  setFormData((prev) => ({ 
    ...prev, 
    file: e.target.files[0], 
    servicelink: "" // Clear link if file is chosen
  }));
};

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await apiDeleteService(id, storedUser.username);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service deleted successfully");
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  const handleAddChange = (e) => {
    setNewService((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addService = async () => {
  try {
    const formData = new FormData();
    formData.append("servicename", newService.servicename);
    formData.append("description", newService.description);
    
    if (newService.file) {
      formData.append("file", newService.file); // The backend will save this and return a path
    } else {
      formData.append("servicelink", newService.servicelink);
    }

    const data = await apiAddService(formData); // Note: API call now sends FormData
    setServices((prev) => [...prev, data.data]);
    toast.success(`Service "${newService.servicename}" added`);
    closeAddModal();
  } catch (err) {
    toast.error("Failed to add service");
  }
};

// Updated formatUrl to handle local paths vs web links
// src/pages/Services.jsx

// src/pages/Services.jsx

// src/pages/Services.jsx

const formatUrl = (path) => {
  if (!path) return "#";

  // 1. Handle external links (google.com, etc.)
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // 2. Handle files (matching your Documents logic)
  // If the path starts with 'uploads/', we append it to the API base URL
  if (path.startsWith('uploads/')) {
    // This results in http://localhost:8080/api/uploads/...
    return `${api.defaults.baseURL}/${path}`;
  }

  // 3. Fallback for raw domains entered without http
  return `https://${path}`;
};

  const closeAddModal = () => {
  setAdding(false);
  setNewService({ 
    servicename: "", 
    description: "", 
    servicelink: "", 
    file: null // Ensure file is cleared
  });
};

  const editService = (service) => {
    setEditingService(service);
    setFormData({
      servicename: service.servicename || "",
      description: service.description || "",
      servicelink: service.servicelink || "",
    });
  };

  const handleEditChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveService = async () => {
  try {
    const dataToSend = new FormData();
    dataToSend.append("servicename", formData.servicename);
    dataToSend.append("description", formData.description);
    
    // Check if we are sending a new file or a link
    if (formData.file) {
      dataToSend.append("file", formData.file);
    } else {
      dataToSend.append("servicelink", formData.servicelink);
    }

    const data = await updateService(editingService.id, dataToSend);
    
    setServices((prev) =>
      prev.map((s) => (s.id === editingService.id ? data.data : s))
    );
    closeEditModal();
    toast.success("Service updated successfully");
  } catch (err) {
    toast.error("Failed to update service");
  }
};

  const closeEditModal = () => setEditingService(null);

  const filteredServices = services.filter((s) =>
    s.servicename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-5">Loading services...</div>;

  return (
    <div className="p-3">
      <div className="mb-3">
        {storedUser?.level !== "Level 1" && (
          <button className="btn btn-primary btn-sm float-end" onClick={() => setAdding(true)}>
            <Plus size={16} className="inline mr-1" /> Add Service
          </button>
        )}
        <input
          className="form-control float-end w-25 form-control-sm mx-2"
          type="text"
          placeholder="Search services..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h2 className="h5">Portal Services</h2>
      </div>

      <hr />

      <table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Service Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length === 0 ? (
            <tr><td colSpan="4" className="text-center text-muted">No services found</td></tr>
          ) : (
            filteredServices.map((service, idx) => (
              <tr key={service.id}>
                <td>{idx + 1}</td>
                <td className="font-weight-bold">{service.servicename}</td>
                <td className="font-weight-bold">{service.description}</td>
                <td>
                  <div className="flex gap-3">
                    {/* <a 
                      href={formatUrl(service.servicelink)} // And use the helper here
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-green-600"
                    >
                      <ExternalLink size={18} />
                    </a> */}
                    <a 
                      href={formatUrl(service.servicelink)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors text-sm"
                    >
                      Go to service
                      <ExternalLink size={16} />
                    </a>
                    
                    {storedUser?.level !== "Level 1" && (
                      <>
                        <button onClick={() => editService(service)} className="text-blue-600">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteService(service.id)} className="text-red-600">
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {adding && (
        <AddServiceModal
          newService={newService}
          handleAddChange={handleAddChange}
          handleFileChange={handleFileChange}
          addService={addService}
          closeAddModal={closeAddModal}
        />
      )}

      {editingService && (
        <EditServiceModal
          formData={formData}
          handleEditChange={handleEditChange}
          handleFileChange={handleEditFileChange}
          saveService={saveService}
          closeEditModal={closeEditModal}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}