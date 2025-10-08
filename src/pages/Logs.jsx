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
        <table className="table">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Entity</th>
              {/* <th className="px-4 py-3 border">Action</th>
              <th className="px-4 py-3 border">Before</th> */}
              <th className="px-4 py-3 border">After</th>
              <th className="px-4 py-3 border">Performed By</th>
              <th className="px-4 py-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
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
                  <td className="px-4 py-3 border">{idx+1}</td>
                  <td className="px-4 py-3 border">{log.entity}</td>
                  <td className="px-4 py-3 border">{log.action}</td>
                  {/* <td className="px-4 py-3 border max-w-xs overflow-hidden">
                    <pre className="whitespace-pre-wrap break-all text-xs">
                      {JSON.stringify(log.beforeData, null, 2)}
                    </pre>
                  </td>
                  <td className="px-4 py-3 border max-w-xs overflow-hidden">
                    <pre className="whitespace-pre-wrap break-all text-xs">
                      {JSON.stringify(log.afterData, null, 2)}
                    </pre>
                  </td> */}
                  <td className="px-4 py-3 border">{log.performedBy}</td>
                  <td className="px-4 py-3 border">
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
