import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";

export default function BackendStatus() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Checking backend connection...");

  useEffect(() => {
    let isActive = true;

    async function checkBackend() {
      try {
        const data = await apiRequest("/api/health");

        if (isActive) {
          setStatus("connected");
          setMessage(data.message);
        }
      } catch {
        if (isActive) {
          setStatus("unavailable");
          setMessage(
            "Backend unavailable. Check that the API server is running.",
          );
        }
      }
    }

    checkBackend();

    return () => {
      isActive = false;
    };
  }, []);

  const statusStyles = {
    checking: "bg-slate-100 text-slate-700",
    connected: "bg-emerald-100 text-emerald-800",
    unavailable: "bg-rose-100 text-rose-800",
  };

  return (
    <section
      aria-labelledby="backend-status-heading"
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2
          id="backend-status-heading"
          className="font-semibold text-slate-900"
        >
          Backend connection
        </h2>

        <p
          role="status"
          aria-live="polite"
          className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusStyles[status]}`}
        >
          {status === "checking"
            ? "Checking"
            : status === "connected"
              ? "Connected"
              : "Unavailable"}
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
      </div>
    </section>
  );
}
