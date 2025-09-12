import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Email from "./Page/Email";          
import ImportPage from "./Page/ImportPage";
import HistoryPage from "./Page/HistoryPage"; 
import SendEmails from "./Page/SendEmails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Email />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/sent-mails" element={<SendEmails />} />
      </Routes>
    </BrowserRouter>
  );
}

