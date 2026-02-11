import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChatLayout } from './chat/ChatLayout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatLayout />} />
        <Route path="/c/:conversationId" element={<ChatLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
