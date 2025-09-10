import React, { useState } from "react";
import axios from "axios";
import Img from "../Page/pexels-pixabay-531880.jpg";
import Loadings from "./Loadings";

export default function Email() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true); 
      const formData = new FormData();
      formData.append("to", to);
      formData.append("subject", subject);
      formData.append("message", message);

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const res = await axios.post(
        "http://localhost:5000/send-email",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert(" Email sent successfully!");
        setTo("");
        setSubject("");
        setMessage("");
        setAttachments([]);
      }
    } catch (err) {
      console.error(err);
      alert(" Failed to send email");
    } finally {
      setLoading(false); 
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
      className="flex items-center"
    >
      {loading ? (
        <Loadings /> 
      ) : (
        <div className="w-[650px] mx-auto my-auto border rounded-2xl shadow-lg bg-white">
          <div className="flex justify-between items-center px-5 py-3 border-b bg-gray-50 rounded-t-2xl">
            <span className="font-semibold text-lg">Compose Email</span>
          </div>

          <div className="p-5 space-y-4">
            <input
              type="email"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full border-b outline-none px-2 py-2"
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border-b outline-none px-2 py-2"
            />
            <textarea
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-40 border-b outline-none px-2 py-2 resize-none"
            ></textarea>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full"
            />

            {attachments.length > 0 && (
              <div className="text-sm text-gray-600">
                <strong>Attachments:</strong>{" "}
                {attachments.map((file) => file.name).join(", ")}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center px-5 py-3 border-t bg-gray-50 rounded-b-2xl">
          <button
              onClick={handleSend}
              disabled={loading}
              className={`px-5 py-2 rounded-lg text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
