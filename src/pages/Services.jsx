// src/pages/Services.jsx
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, ExternalLink, Plus } from "lucide-react";
import {
  getServices,
  addService as apiAddService,
  updateService,
  deleteService as apiDeleteService,
} from "../services/service";
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
    servicelink: "",
  });

  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    servicename: "",
    servicelink: "",
  });

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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
      const data = await apiAddService(newService);
      setServices((prev) => [...prev, data.data]);
      toast.success(`Service "${newService.servicename}" added`);
      closeAddModal();
    } catch (err) {
      toast.error("Failed to add service");
    }
  };

  const closeAddModal = () => {
    setAdding(false);
    setNewService({ servicename: "", servicelink: "" });
  };

  const editService = (service) => {
    setEditingService(service);
    setFormData({
      servicename: service.servicename || "",
      servicelink: service.servicelink || "",
    });
  };

  const handleEditChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveService = async () => {
    try {
      const data = await updateService(editingService.id, formData);
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

  const formatUrl = (url) => {
    if (!url) return "#";
    // If the url doesn't start with http:// or https://, prepend https://
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

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
            <th>Link</th>
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
                <td>
                  <a 
                    href={formatUrl(service.servicelink)} // Use the helper here
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-primary truncate d-inline-block" 
                    style={{maxWidth: '300px'}}
                  >
                    {service.servicelink}
                  </a>
                </td>
                <td>
                  <div className="flex gap-3">
                    <a 
                      href={formatUrl(service.servicelink)} // And use the helper here
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-green-600"
                    >
                      <ExternalLink size={18} />
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
          addService={addService}
          closeAddModal={closeAddModal}
        />
      )}

      {editingService && (
        <EditServiceModal
          formData={formData}
          handleEditChange={handleEditChange}
          saveService={saveService}
          closeEditModal={closeEditModal}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}