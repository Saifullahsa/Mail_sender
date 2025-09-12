import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Img from "../Page/pexels-pixabay-531880.jpg";
import ImportIcon from "./Importicon";

export default function ImportPage() {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send Excel emails");
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
    className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 w-[320px] p-6 rounded-xl shadow-2xl space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2"><ImportIcon/></h2>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
          className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-700 file:text-white hover:file:bg-blue-600 cursor-pointer"
        />
        {importFile && (
          <p className="text-xs mt-1">Selected: <strong>{importFile.name}</strong></p>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
          >
            Back
          </button>
          <button
            onClick={handleSendExcel}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            Send Emails
          </button>
        </div>
      </div>
    </div>
  );
}
