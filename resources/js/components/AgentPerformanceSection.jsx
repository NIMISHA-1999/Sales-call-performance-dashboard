import React, { useRef, useState, useEffect } from "react";
import { FaCheckSquare, FaFilter } from "react-icons/fa";
import "./dashboard.css";


export default function AgentPerformanceSection() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [performanceData, setPerformanceData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);



    const fileInputRef = useRef(null);

     // Fetch CSRF token (only if using web.php routes)
    const getCsrfToken = async () => {
    const res = await fetch("http://127.0.0.1:8000/csrf-token");
    const data = await res.json();
    return data.csrf_token;
};


 const handleFileUpload = async (e) => {
  const token = await getCsrfToken();

  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('http://127.0.0.1:8000/upload', {
    method: 'POST',
    body: formData,
    headers: {
     'X-CSRF-TOKEN': token
  },
  
  });

  const data = await res.json();
  alert(data.message);
   if (res.ok) {
      fetchUploadedFiles(); // Refresh list after upload
    } else {
      console.error("Server error:", data);
    }

};

 // Fetch uploaded files from backend
  // const fetchUploadedFiles = async (page = 1) => {
  //   const res = await fetch("http://127.0.0.1:8000/uploaded-files?page=${page}");
  //   const data = await res.json();
  //   console.log("Fetched data:", data); // check exact structure
  //    console.log("File name:", data[0].file_name); 
  //    setCurrentPage(data.current_page);
  //     setLastPage(data.last_page);
  //   setUploadedFiles(Array.isArray(data) ? data : data.data);
  // };

  // // Load files when component mounts
  // useEffect(() => {
  //   fetchUploadedFiles();
  // }, []);

 const fetchUploadedFiles = async (page = 1) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/uploaded-files?page=${page}`);
      const data = await res.json();
      setUploadedFiles(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles(currentPage);
  }, [currentPage]);

   useEffect(() => {
    async function fetchPerformance() {
      const res = await fetch("http://127.0.0.1:8000/agent-performance");
      const data = await res.json();
      setPerformanceData(data);
      console.log('call performance data:', data);
    }
    fetchPerformance();
  }, []);

  // Helper to format seconds to hh:mm:ss
  const formatTime = (seconds) => {
    if (!seconds) return "0:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };


  function renderPageNumbers(currentPage, lastPage, setCurrentPage) {
  const pageNumbers = [];

  if (lastPage <= 10) {
    // Show all pages if 10 or less
    for (let i = 1; i <= lastPage; i++) {
      pageNumbers.push(i);
    }
  } else {
    // More than 10 pages: show 1, 2, ..., current-1, current, current+1, ..., last-1, last
    pageNumbers.push(1, 2);

    if (currentPage > 4) {
      pageNumbers.push("...");
    }

    const startPage = Math.max(3, currentPage - 1);
    const endPage = Math.min(lastPage - 2, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < lastPage - 3) {
      pageNumbers.push("...");
    }

    pageNumbers.push(lastPage - 1, lastPage);
  }

  return pageNumbers.map((num, idx) => {
    if (num === "...") {
      return (
        <span key={`ellipsis-${idx}`} style={{ padding: "5px 10px", userSelect: "none" }}>
          ...
        </span>
      );
    }

    return (
      <button
        key={num}
        onClick={() => setCurrentPage(num)}
        style={{
          border: "none",
          padding: "8px 12px",
          borderRadius: "8px",
          backgroundColor: currentPage === num ? "white" : "transparent",
          cursor: currentPage === num ? "default" : "pointer",
          fontWeight: currentPage === num ? "700" : "400",
          color: "#004085",
          boxShadow: currentPage === num ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
          transition: "background-color 0.2s ease"
        }}
      >
        {num}
      </button>
    );
  });
}



  return (
    <>
      {/* Agent Wise Performance Section */}
      <section className="agent-performance">
         <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div>
          <h2 >Agent Wise Performance Section</h2>
          <p style={{ margin: 0, color: "#555" }}>
            Insights into each agent's call activity & response rates
          </p>
        </div>

        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#333",
          }}
        >
          <FaFilter />
        </button>
      </div>
<br></br>

       <table
    style={{
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      border: "1px solid #ccc",
      borderRadius: "8px",
      overflow: "hidden",
    }}
  >
    <thead
      style={{
        backgroundColor: "#f9fafb",
        height: "50px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <tr style={{ border: "1px solid #ccc", padding: "12px" }}>
              <th style={{  padding: "12px" }}>Agent Name, Ext. No.</th>
              <th style={{  padding: "12px" }}>Total Sales</th>
              <th style={{  padding: "12px" }}>Talk Time</th>
              <th style={{  padding: "12px" }}>Answered</th>
              <th style={{  padding: "12px" }}>Unanswered</th>
              <th style={{  padding: "12px" }}>Total Calls</th>
              <th style={{  padding: "12px" }}>Answered %</th>
            </tr>
          </thead>
         <tbody>
  {performanceData.length > 0 ? (
    performanceData.map((agent, idx) => (
      // <tr key={idx} style={{ border: "1px solid #ccc", padding: "12px" }}>
       <tr
            key={idx}
            style={{
              backgroundColor: idx % 2 === 0 ? "#d9e9ff" : "white", border: "1px solid #ccc",
            }}
          >
  <td style={{ padding: "15px", textAlign: "center"  }}>{agent.agent_name}</td>
<td style={{ padding: "12px", textAlign: "center" }}>{agent.total_calls}</td>
<td style={{ padding: "12px", textAlign: "center" }}>{agent.talk_time}</td>
<td style={{ padding: "12px", textAlign: "center" }}>{agent.answered_calls}</td>
<td style={{ padding: "12px", textAlign: "center" }}>{agent.unanswered_calls}</td>
<td style={{ padding: "12px", textAlign: "center" }}>{agent.total_calls}</td>
<td style={{ padding: "12px", textAlign: "center" }}>{parseFloat(agent.answered_percentage).toFixed(2)}%</td>
</tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        No data available
      </td>
    </tr>
  )}
</tbody>
        </table>
      </section>

      {/* Agent Call Activity Performance Report */}
      <section className="agent-upload" >
      <h2>Agent Call Activity Performance Report</h2>
      <p>Upload call activity reports to analyze agent wise performance.</p>

      <div className="upload-box">
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
 <div className="upload-icon">☁️⬆️</div>
        <button
          type="button"
          className="choose-btn"
          onClick={() => fileInputRef.current.click()}
        >
          Choose File
        </button>

        <p>Only Excel files are supported, with a maximum size of 50 MB.</p>
      </div>
    </section>

 {/* Uploaded file history */}
     <section
  className="agent-upload"
  style={{ marginTop: "2rem", marginBottom: "40px" }}
>
  <h3>Uploaded Files History</h3>
  <table
    style={{
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      border: "1px solid #ccc",
      borderRadius: "8px",
      overflow: "hidden",
    }}
  >
    <thead
      style={{
        backgroundColor: "#f9fafb",
        height: "50px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <tr>
        <th style={{  padding: "12px" }}>
          Uploaded Date
        </th>
        <th style={{  padding: "12px" }}>
          File Name
        </th>
        <th style={{ padding: "12px" }}>Status</th>
        <th style={{  padding: "12px" }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {uploadedFiles.length > 0 ? (
        uploadedFiles.map((file, idx) => (
          <tr
            key={file.id}
            style={{
              backgroundColor: idx % 2 === 0 ? "#d9e9ff" : "white", 
            }}
          >
            <td style={{ padding: "12px", textAlign: "center"  }}>
              {new Date(file.created_at).toISOString().slice(0, 10)}
            </td>
            <td style={{ padding: "12px", textAlign: "center"  }}>
              {file.file_name.replace(/^(\d+_)+/, "")}

            </td>
            <td style={{ padding: "12px", textAlign: "center"  }}>
              <FaCheckSquare style={{ marginRight: "5px", color: "green" }} />
              {file.status}
            </td>
            <td style={{ padding: "12px", textAlign: "center" }}>
              <a
                   href={`/storage/uploads/${file.file_name}`}
                style={{ color: "blue", textDecoration: "none" }}
              >
                🔍 View
              </a>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="4"
            style={{
              textAlign: "center",
              padding: "12px",
              border: "1px solid #ccc",
            }}
          >
            No files uploaded yet
          </td>
        </tr>
      )}
    </tbody>
  </table>
  {/* Pagination Wrapper */}
<div
  style={{
    display: "flex",
    justifyContent: "center", // horizontal center
    alignItems: "center",     // vertical center
    // minHeight: "100vh",       // full screen height
  }}
>
  {/* Pagination Controls */}
  <div
    style={{
      marginTop: "1rem",
      textAlign: "center",
      backgroundColor: "#d9e9ff",
      borderRadius: "8px",
      padding: "15px",
      userSelect: "none",
      fontSize: "14px",
      color: "#333",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      minWidth: "500px",
      justifyContent: "center"
    }}
  >
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      style={{
        background: "none",
        border: "none",
        cursor: currentPage === 1 ? "default" : "pointer",
        fontWeight: "700",
        fontSize: "13px",
        padding: "5px 10px",
        display: "flex",
        alignItems: "center",
        gap: "5px"
      }}
    >
      ← <span>Previous</span>
    </button>

    {renderPageNumbers(currentPage, lastPage, setCurrentPage)}

    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, lastPage))}
      disabled={currentPage === lastPage}
      style={{
        background: "none",
        border: "none",
        cursor: currentPage === lastPage ? "default" : "pointer",
        fontWeight: "700",
        fontSize: "13px",
        padding: "5px 10px",
        display: "flex",
        alignItems: "center",
        gap: "5px"
      }}
    >
      <span>Next</span> →
    </button>
  </div>
</div>


</section>

    </>
  );
}
