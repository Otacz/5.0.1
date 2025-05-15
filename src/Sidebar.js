
import React from "react";

const Sidebar = ({ threads, setActiveThread, createNewThread, activeThread }) => {
  return (
    <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px" }}>
      <h3>Vlákna</h3>
      <button onClick={createNewThread}>➕ Nové vlákno</button>
      <ul>
        {threads.map(thread => (
          <li key={thread.id} style={{ 
            marginTop: "10px", 
            cursor: "pointer",
            fontWeight: thread.id === activeThread ? "bold" : "normal"
          }} onClick={() => setActiveThread(thread.id)}>
            {thread.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
