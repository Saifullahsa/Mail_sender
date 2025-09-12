import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Receive from "./Receiveing"; 
import Img from "../Page/pexels-pixabay-531880.jpg";
import Home from "./Home"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopesBulk } from "@fortawesome/free-solid-svg-icons";

interface Email {
  id: number;
  receiver: string;
  subject: string;
  message: string;
  sent_at: string | null;
}

export default function SentEmails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const res = await axios.get("http://localhost:5000/sent-emails");
        setEmails(res.data.sentEmails);
      } catch (err) {
        console.error("Failed to fetch sent emails:", err);
        alert("Failed to fetch sent emails");
      } finally {
        setLoading(false);
      }
    };
    fetchSentEmails();
  }, []);


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
      className="min-h-screen text-white p-6"
    >
        <div className="flex justify-between">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">
       <FontAwesomeIcon icon={faEnvelopesBulk} className="text-3xl text-blue-500" /> Sent Emails
      </h1>
       <button
                onClick={() => navigate("/")}
                className="px-3 my-auto bg-gray-700 text-white rounded-lg hover:bg-gray-600 border-2"
              >
                <Home/>
              </button>
        </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Receive />
        </div>
      ) : emails.length === 0 ? (
        <p className="text-sm text-gray-400 text-center">No sent emails found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {emails.map((email) => (
            <div
              key={email.id}
              className="p-4 rounded-lg bg-black/60 shadow-md border-2 border-gray-400"
            >
              <p>
                <span className="font-semibold text-green-300">To: </span>
                {email.receiver}
              </p>
              <p>
                <span className="font-semibold text-yellow-300">Subject: </span>
                {email.subject || "No Subject"}
              </p>
              <p>
                <span className="font-semibold text-blue-300">Message: </span>
                {email.message || "No Message"}
              </p>
              <p>
                <span className="font-semibold text-red-300">Sent At: </span>
                {email.sent_at ? new Date(email.sent_at).toLocaleString() : "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
