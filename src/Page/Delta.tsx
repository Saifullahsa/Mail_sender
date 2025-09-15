import React, { useState, useEffect } from "react";
import Img from "../Page/pexels-pixabay-531880.jpg";

interface Mail {
  id: string;
  subject: string;
  sender: string;
  receiver: string;
  received_at?: string;
}

export default function DeltaMails() {
  const [unread, setUnread] = useState<Mail[]>([]);
  const [allMails, setAllMails] = useState<Mail[]>([]);
  const [lastDeltaId, setLastDeltaId] = useState<string | null>(null);
  const [loadingUnread, setLoadingUnread] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [inboxTotal, setInboxTotal] = useState(0);
  const [augSeptUnread, setAugSeptUnread] = useState(0);

  const [allPage, setAllPage] = useState(1);
  const [allTotalPages, setAllTotalPages] = useState(1);

  const API_BASE = "http://localhost:5000";

  async function loadDelta() {
    if (loadingUnread) return;
    setLoadingUnread(true);
    setError(null);
    try {
      const url = lastDeltaId
        ? `${API_BASE}/delta-mails?lastId=${encodeURIComponent(lastDeltaId)}`
        : `${API_BASE}/delta-mails`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json.data && json.data.length > 0) {
        setUnread((prev) => {
          const existing = new Set(prev.map((m) => m.id));
          const newOnes = json.data.filter((m: Mail) => !existing.has(m.id));
          return [...prev, ...newOnes];
        });
        setLastDeltaId(json.lastDeltaId || lastDeltaId);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingUnread(false);
    }
  }

  async function loadStats() {
    try {
      const res = await fetch(`${API_BASE}/mail-stats-aug-sept`);
      if (res.ok) {
        const j = await res.json();
        setInboxTotal(j.totalInbox);
        setAugSeptUnread(j.totalUnread);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function loadAllMails(page = 1) {
    if (loadingAll || page < 1 || (allTotalPages && page > allTotalPages)) return;
    setLoadingAll(true);
    try {
      const res = await fetch(`${API_BASE}/all-mails?page=${page}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      setAllMails(j.data);
      setAllTotalPages(j.totalPages);
      setAllPage(page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingAll(false);
    }
  }

  useEffect(() => {
    loadStats();
    loadDelta();
    loadAllMails(1);
  }, []);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: `url(${Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white drop-shadow">
          Unread Emails (Delta Fetch)
        </h1>
        <button
          onClick={loadDelta}
          disabled={loadingUnread}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {loadingUnread ? "Loading…" : "Load More Unread"}
        </button>
      </div>

      <div className="text-white mb-6 space-y-1">
        <p>Total Inbox Mails (Aug 15 – Sept 15): <span className="font-bold">{inboxTotal}</span></p>
        <p>Unread (Aug 15 – Sept 15): <span className="font-bold">{augSeptUnread}</span></p>
        <p>Currently Loaded Unread: <span className="font-bold">{unread.length}</span></p>
      </div>

      {error && <p className="text-red-400 mb-4">Error: {error}</p>}

      <h2 className="text-xl font-semibold text-white mb-3">Unread</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {unread.map((m) => (
          <div
            key={m.id}
            className="rounded-xl p-4 bg-black/60 backdrop-blur-md border border-white/20 shadow-lg text-white"
          >
            <p><span className="text-green-400">From:</span> {m.sender}</p>
            <p><span className="text-green-400">To:</span> {m.receiver}</p>
            <p><span className="text-yellow-300">Subject:</span> {m.subject || "No Subject"}</p>
            <p><span className="text-red-400">Received:</span> {m.received_at ? new Date(m.received_at).toLocaleString() : "Unknown"}</p>
          </div>
        ))}
        {unread.length === 0 && !loadingUnread && (
          <p className="text-gray-200">No unread mails.</p>
        )}
      </div>

      <h2 className="text-xl font-semibold text-white mb-3">All Mails</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allMails.map((m) => (
          <div
            key={m.id}
            className="rounded-xl p-4 bg-black/40 backdrop-blur-md border border-white/20 shadow text-white"
          >
            <p><span className="text-green-400">From:</span> {m.sender}</p>
            <p><span className="text-green-400">To:</span> {m.receiver}</p>
            <p><span className="text-yellow-300">Subject:</span> {m.subject || "No Subject"}</p>
            <p><span className="text-red-400">Received:</span> {m.received_at ? new Date(m.received_at).toLocaleString() : "Unknown"}</p>
          </div>
        ))}
      </div>

      {allTotalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-1 text-white">
          <button
            onClick={() => loadAllMails(allPage - 1)}
            disabled={loadingAll || allPage === 1}
            className="px-2 py-1 rounded border border-white/40 disabled:opacity-40 hover:bg-purple-600"
          >
            &lt;
          </button>

          {(() => {
            const pages: (number | string)[] = [];
            const total = allTotalPages;

            if (total <= 7) {
              for (let i = 1; i <= total; i++) pages.push(i);
            } else {
              pages.push(1);
              if (allPage > 3) pages.push("…");
              const start = Math.max(2, allPage - 1);
              const end = Math.min(total - 1, allPage + 1);
              for (let i = start; i <= end; i++) pages.push(i);
              if (allPage < total - 2) pages.push("…");
              pages.push(total);
            }

            return pages.map((p, idx) =>
              p === "…" ? (
                <span key={idx} className="px-2">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => loadAllMails(p as number)}
                  disabled={loadingAll || p === allPage}
                  className={`px-3 py-1 rounded border ${
                    p === allPage
                      ? "bg-purple-700 border-purple-700"
                      : "border-white/40 hover:bg-purple-600"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}

          <button
            onClick={() => loadAllMails(allPage + 1)}
            disabled={loadingAll || allPage === allTotalPages}
            className="px-2 py-1 rounded border border-white/40 disabled:opacity-40 hover:bg-purple-600"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
