import { useState } from "react";
// Import apiRequest - this handles credentials, headers, and base URL automatically
import { apiRequest } from "../lib/api";

interface HealthResponse {
  status?: string;
  timestamp?: string;
  [key: string]: any;
}

export default function Health() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    console.log("Health check started");
    
    setLoading(true);
    setError(null);

    try {
      // Use apiRequest instead of fetch
      // apiRequest automatically adds:
      // - credentials: "include" (for cookies)
      // - Content-Type: application/json header
      // - Base API URL from env variable
      const response = await apiRequest("/health");
      
      console.log("Health response:", response.status, response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Health data:", data);
      
      setHealthData(data);
    } catch (err) {
      console.log("Health error:", err instanceof Error ? err.message : "Unknown error");
      
      setError(
        err instanceof Error ? err.message : "Failed to fetch health status"
      );
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Health Check</h1>

      <button
        onClick={checkHealth}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Checking..." : "Check Health"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {healthData && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Health Status</h2>
          <pre className="bg-white p-4 rounded overflow-auto">
            {JSON.stringify(healthData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
