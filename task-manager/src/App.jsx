import React from "react";
import TaskManager from "./components/TaskManager";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster position="top-right" />
      <TaskManager />
    </div>
  );
}

export default App;
