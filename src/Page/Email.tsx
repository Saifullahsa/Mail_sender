import React, { useState } from "react";
import axios from "axios";
import Img from "../Page/pexels-pixabay-531880.jpg";
import Loadings from "./Loadings";
import Receive from "./Receiveing";  
import Emails from "./Mailimg";

export default function Email() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);          
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<
    { id: string; from: string; to: string; subject: string; date: string }[]
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setAttachments(Array.from(e.target.files));
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("to", to);
      formData.append("subject", subject);
      formData.append("message", message);
      attachments.forEach((file) => formData.append("attachments", file));

      const res = await axios.post("http://localhost:5000/send-email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        alert("Email sent successfully!");
        setTo(""); setSubject(""); setMessage(""); setAttachments([]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const handleSendExcel = async () => {
    if (!importFile) return alert("Please select an Excel file!");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("excel", importFile);

      const res = await axios.post("http://localhost:5000/send-excel-emails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        alert(res.data.message);
        setImportFile(null);
        setShowImportModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send Excel emails");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/read-mails");
      if (res.status === 200) setHistory(res.data.messages);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch email history");
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
      className="flex items-center justify-center"
    >
      {loading ? (
        <Loadings />
      ) : (
        <div className="w-[350px] max-w-[90%] h-[500px] mx-auto border rounded-2xl shadow-2xl bg-black bg-opacity-70 text-white backdrop-blur-md flex flex-col justify-between">
          <div className="flex justify-between items-center px-5 py-3 border-b border-gray-700 rounded-t-2xl">
            <span className="font-semibold text-lg">Compose Email</span>
            <button
              onClick={fetchHistory}
              className="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-600 shadow-lg"
            >
              History
            </button>
          </div>

          <div className="p-5 space-y-6 overflow-y-auto">
            <div>
              <label className="text-sm font-medium mb-1 float-left">To</label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-2 border-gray-500 rounded-xl outline-none text-sm focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 float-left">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-2 border-gray-500 rounded-xl outline-none text-sm focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 float-left">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 h-28 bg-transparent border-2 border-gray-500 rounded-xl outline-none text-sm resize-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 float-left">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="
                  block w-full text-sm text-white
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-700 file:text-white
                  hover:file:bg-blue-600
                  cursor-pointer
                "
              />
              {attachments.length > 0 && (
                <div className="text-xs text-gray-300 mt-1">
                  <strong>Selected:</strong> {attachments.map(f => f.name).join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center px-5 py-3 border-t border-gray-700 rounded-b-2xl">
            <button
              onClick={handleSend}
              className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              Send
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 shadow-lg"
            >
              <Emails /> Import Excel
            </button>
          </div>
        </div>
      )}

      {!loading && showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white w-[300px] rounded-xl shadow-2xl p-6 space-y-4 text-black">
            <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">
              Import Excel File
            </h2>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-700 file:text-white hover:file:bg-blue-600 cursor-pointer"
            />
            {importFile && (
              <p className="text-xs text-black mt-1">
                Selected: <strong>{importFile.name}</strong>
              </p>
            )}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSendExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Send Emails
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 w-[400px] max-h-[80vh] rounded-xl shadow-2xl p-6 space-y-4 
          text-white overflow-y-auto border-2">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 text-yellow-400">
              Email History
            </h2>

            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Receive />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-400 mt-2">No emails found.</p>
            ) : (
              <div className="space-y-4 mt-2">
                {history.map((mail) => (
                  <div
                    key={mail.id}
                    className="p-3 rounded-lg bg-gradient-to-r from-black via-green-900 to-black shadow-md border-2 border-yellow-400"
                  >
                    <p>
                      <span className="font-semibold text-green-300">From: </span>
                      <span className="text-white">{mail.from}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-blue-300">To: </span>
                      <span className="text-white">{mail.to}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-yellow-300">Subject: </span>
                      <span className="text-white">{mail.subject}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-red-300">Date: </span>
                      <span className="text-white">
                        {new Date(mail.date).toLocaleString()}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-gray-700">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
