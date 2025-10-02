import React, { useEffect, useState } from "react";
import { getLogs } from "../services/logs";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading logs...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">System Logs</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 border">ID</th>
              <th className="px-4 py-3 border">Entity</th>
              <th className="px-4 py-3 border">Action</th>
              <th className="px-4 py-3 border">Before</th>
              <th className="px-4 py-3 border">After</th>
              <th className="px-4 py-3 border">Performed By</th>
              <th className="px-4 py-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr
                  key={log.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 border">{log.id}</td>
                  <td className="px-4 py-3 border">{log.entity}</td>
                  <td className="px-4 py-3 border">{log.action}</td>
                  <td className="px-4 py-3 border max-w-xs overflow-hidden">
                    <pre className="whitespace-pre-wrap break-all text-xs">
                      {JSON.stringify(log.beforeData, null, 2)}
                    </pre>
                  </td>
                  <td className="px-4 py-3 border max-w-xs overflow-hidden">
                    <pre className="whitespace-pre-wrap break-all text-xs">
                      {JSON.stringify(log.afterData, null, 2)}
                    </pre>
                  </td>
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
