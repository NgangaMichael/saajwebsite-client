import { useEffect, useState } from "react";
import { Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDocuments } from "../services/documents";

export default function Homedocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getDocuments();
        setDocs(data.data || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Extract unique types from documents to create "Folders"
  const folderTypes = [...new Set(docs.map((doc) => doc.type).filter(Boolean))].sort();

  const openFolder = (type) => {
    // Navigate to the existing documents route with a query parameter
    navigate(`/dashboard/documents?type=${encodeURIComponent(type)}`);
  };

  if (loading) return <div className="p-5 text-center">Loading Folders...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 h4">Document Library</h2>
      <hr />
      
      <div className="row g-4">
        {folderTypes.length > 0 ? (
          folderTypes.map((type, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4">
              <div 
                className="card h-100 text-center border-0 shadow-sm hover-shadow" 
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => openFolder(type)}
              >
                <div className="card-body py-5">
                  <div className="d-flex justify-content-center mb-3">
                    {/* Big Folder Icon */}
                    <Folder 
                      size={80} 
                      className="text-warning" 
                      fill="#ffc107" 
                      fillOpacity={0.2} 
                    />
                  </div>
                  <h5 className="card-title text-dark mb-0 text-truncate">
                    {type}
                  </h5>
                  <p className="text-muted small mt-2">
                    {docs.filter(d => d.type === type).length} Documents
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No document types found.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}