import React, { useEffect, useState } from "react";
import { getLogs } from "../services/logs";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data); // backend already returns array
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((u) =>
    u.action?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading logs...</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div>
        <input
          className="form-control float-end w-25 form-control-sm mx-2"
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h2 className="h5">System Logs</h2>
      </div>

      <hr />

      {/* Table */}
      <div className="">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="">
              <th scope="col">#</th>
              <th scope="col">Entity</th>
              <th scope="col">Action</th>
              {/* <th scope="col">Affected</th> */}
              <th scope="col">Performed By</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr
                  key={log.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td>{idx+1}</td>
                  <td>{log.entity}</td>
                  <td
                    style={{
                      color:
                        log.action === "CREATE"
                          ? "green"
                          : log.action === "UPDATE"
                          ? "orange"
                          : "red", // for DELETE or anything else
                      fontWeight: "500",
                    }}
                  >
                    {log.action}
                  </td>
                  {/* <td>{log.beforeData}</td> */}
                  <td>{log.performedBy}</td>
                  <td>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
