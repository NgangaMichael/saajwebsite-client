import React, { useEffect, useState } from "react";
import { Eye, Reply } from "lucide-react";
import { getCommunications } from "../services/communication";

export default function Inbox() {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // View + Reply state
  const [viewingComm, setViewingComm] = useState(null);
  const [replyingComm, setReplyingComm] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Fetch communications
  const fetchCommunications = async () => {
    try {
      const data = await getCommunications();
      setCommunications(data.data);
    } catch (err) {
      console.error("Error fetching communications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, []);

  // View handlers
  const viewComm = (comm) => setViewingComm(comm);
  const closeViewModal = () => setViewingComm(null);

  // Reply handlers
  const replyToComm = (comm) => {
    setReplyingComm(comm);
    setReplyMessage("");
  };
  const closeReplyModal = () => setReplyingComm(null);

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) {
      alert("Please type a reply before sending.");
      return;
    }

    // TODO: connect to backend API later
    console.log("Reply sent to:", replyingComm.title);
    console.log("Message:", replyMessage);

    // Close modal
    setReplyingComm(null);
    setReplyMessage("");

    alert("Reply sent successfully!");
  };

  const filteredCommunications = communications.filter((u) =>
    u.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading communications...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <input
          className="form-control float-end w-25 form-control-sm mx-2"
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h2 className="h5">Inbox</h2>
      </div>

      <hr />

      <div>
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="">
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Level</th>
              <th scope="col">To</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommunications.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No communications found
                </td>
              </tr>
            ) : (
              filteredCommunications.map((comm, idx) => (
                <tr
                  key={comm.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td>{idx + 1}</td>
                  <td>{comm.title}</td>
                  <td>{comm.level}</td>
                  <td>{comm.to}</td>
                  <td>
                    {new Date(comm.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border">
                    <div className="flex justify-center gap-3">
                      {/* View Button */}
                      <button
                        onClick={() => viewComm(comm)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="View communication"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Reply Button */}
                      <button
                        onClick={() => replyToComm(comm)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Reply to message"
                      >
                        <Reply size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewingComm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              Communication Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold">Member Number:</label>
                <p>{viewingComm.memberNumber}</p>
              </div>
              <div>
                <label className="font-semibold">Title:</label>
                <p>{viewingComm.title}</p>
              </div>
              <div>
                <label className="font-semibold">Info:</label>
                <p className="whitespace-pre-wrap">{viewingComm.info}</p>
              </div>
              <div>
                <label className="font-semibold">Level:</label>
                <p>{viewingComm.level}</p>
              </div>
              <div>
                <label className="font-semibold">Posted By:</label>
                <p>{viewingComm.postedBy}</p>
              </div>
              <div>
                <label className="font-semibold">To:</label>
                <p>{viewingComm.to}</p>
              </div>
              <div>
                <label className="font-semibold">Created At:</label>
                <p>{new Date(viewingComm.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="font-semibold">Updated At:</label>
                <p>{new Date(viewingComm.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingComm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">
              Reply to: {replyingComm.title}
            </h3>

            <textarea
              className="form-control w-100 mb-3"
              rows="5"
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeReplyModal}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
