import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Receive from "./Receiveing"; 
import Img from "../Page/pexels-pixabay-531880.jpg";
import Home from "./Home";
import Unseen from "./Unseen";
import RefreshIcon from "./Refresh";

interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  // Load initial emails
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getmails");
        const newMails: Mail[] = res.data.data.map((m: any) => ({
          id: m.id,
          from: m.sender,
          to: m.receiver,
          subject: m.subject,
          date: m.received_at,
        }));

        const existingIds = new Set(history.map((h) => h.id));
        const merged = [
          ...newMails.filter((m) => !existingIds.has(m.id)),
          ...history,
        ];

        if (merged.length === history.length) {
          alert("No new emails since last refresh.");
        } else {
          setHistory(merged);
        }
      } catch (err) {
        console.error("Refresh failed:", err);
        alert("Refresh failed — check server logs");
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, []);

  // Refresh handler
  const handleRefresh = async () => {
    try {
      setSpinning(true); // start spinning
      const res = await axios.get("http://localhost:5000/read-mails");
      const newMails: Mail[] = res.data.data.map((m: any) => ({
        id: m.id,
        from: m.sender,
        to: m.receiver,
        subject: m.subject,
        date: m.received_at,
      }));
      setHistory(newMails);
    } catch (err) {
      console.error("Fetch history error:", err);
      alert("Failed to fetch email history");
    } finally {
      setSpinning(false); // stop spinning
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100%",
      }}
      className="text-white p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-yellow-400">
          <Unseen />
        </h2>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg border-2 border-gray-500 hover:bg-gray-600 transition"
          >
            <Home />
          </button>

          <button
            onClick={handleRefresh}
            className="px-3 py-1 rounded-lg transition"
            title="Refresh emails"
          >
            <RefreshIcon spinning={spinning} />
          </button>
        </div>
      </div>

      {/* Email List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Receive />
        </div>
      ) : history.length === 0 ? (
        <p className="mt-8 text-center text-xl text-gray-600">
          <b>No emails found.</b>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {history.map((mail) => (
            <div
              key={mail.id}
              className="p-4 rounded-lg bg-black/80 shadow-md border border-gray-500 hover:shadow-lg transition"
            >
              <p>
                <span className="font-semibold text-green-300">From: </span>
                {mail.from}
              </p>
              <p>
                <span className="font-semibold text-blue-300">To: </span>
                {mail.to}
              </p>
              <p>
                <span className="font-semibold text-yellow-300">Subject: </span>
                {mail.subject || "(no subject)"}
              </p>
              <p>
                <span className="font-semibold text-red-300">Date: </span>
                {new Date(mail.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
