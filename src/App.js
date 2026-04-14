import React from "react";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <SideBar />
      <AddModal />
    </div>
  );
}

function SideBar() {
  return (
    <div className="sidebar">
      <p>Sidebar</p>
    </div>
  );
}

function AddModal() {
  return (
    <div className="add-modal">
      <p>Add Modal</p>
    </div>
  );
}
