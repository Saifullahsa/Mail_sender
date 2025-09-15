import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Img from "../Page/pexels-pixabay-531880.jpg";
import Loadings from "./Loadings";
import Emails from "./Mailimg";
import Menu from "./Menu";
import Close from './Close'

export default function Email() {
  const navigate = useNavigate();

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

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

  return (
    <div
      style={{
        backgroundImage: `url(${Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
      className="flex items-center justify-center relative overflow-hidden"
    >
      <button
        onClick={() => setShowSidebar(true)}
        className="absolute top-6 left-6 p-3 bg-black bg-opacity-60 rounded-full shadow-xl hover:bg-opacity-80 backdrop-blur-md transition border-2"
      >
        <Menu />
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black bg-opacity-70 
                    backdrop-blur-xl text-white z-40 rounded-r-3xl border-r-4 border-yellow-400
                    transform transition-transform duration-300 ease-in-out
                    ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col gap-6 relative h-full">
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-4 right-4 text-yellow-400 text-2xl hover:scale-110 transition"
            title="Close"
          >
            <Close/>
          </button>

          <button
  onClick={() => { navigate("/sent-mails"); setShowSidebar(false); }}
  className="w-full mt-10 bg-gradient-to-r from-purple-500 to-purple-400 text-black px-4 py-3 rounded-xl hover:from-purple-400 hover:to-purple-500 shadow-lg font-semibold"
>
  Sent Emails
</button>


          <button
            onClick={() => { navigate("/history"); setShowSidebar(false); }}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 text-black px-4 py-3 rounded-xl hover:from-yellow-400 hover:to-yellow-500 shadow-lg font-semibold"
          >
            Received
          </button>

             <button
            onClick={() => { navigate("/delta-mails"); setShowSidebar(false); }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-300 text-black px-4 py-3 rounded-xl hover:from-yellow-400 hover:to-yellow-500 shadow-lg font-semibold"
          >
            Delta-mails
          </button>

          <button
            onClick={() => { navigate("/import"); setShowSidebar(false); }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-400 px-4 py-3 rounded-xl hover:from-green-400 hover:to-emerald-500 shadow-lg flex items-center justify-center gap-2 font-semibold"
          >
              <Emails /> Import Excel
          </button>

          
        </div>
      </div>

      {loading ? (
        <Loadings />
      ) : (
        <div className="w-[380px] max-w-[90%] h-[520px] mx-auto rounded-3xl shadow-2xl bg-black bg-opacity-70 text-white backdrop-blur-md flex flex-col justify-between">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-400 rounded-t-3xl">
            <span className="font-semibold text-lg tracking-wide">Compose Email</span>
          </div>

          <div className="p-5 space-y-6 overflow-y-auto">
            <div>
              <label className="text-sm font-medium mb-1 float-left">To</label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-2 border-gray-500 rounded-xl outline-none text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 float-left">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-2 border-gray-500 rounded-xl outline-none text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 float-left">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 h-28 bg-transparent border-2 border-gray-500 rounded-xl outline-none text-sm resize-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 float-left">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-white
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-500 cursor-pointer"
              />
              {attachments.length > 0 && (
                <div className="text-xs text-gray-300 mt-1">
                  <strong>Selected:</strong> {attachments.map(f => f.name).join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center px-5 py-3 border-t border-gray-400 rounded-b-3xl">
            <button
              onClick={handleSend}
              className="px-5 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 shadow-lg font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
