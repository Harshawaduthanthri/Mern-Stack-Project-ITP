import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import AdminMenu from "./Layout/AdminMenu";
import axios from "axios";

export default function MyForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [receiverEmail, setReceiverEmail] = useState(""); // State for receiver's email
  const [userManagers, setUserManagers] = useState([]); // State for employee managers

  useEffect(() => {
    fetchEmployeeManagers();
  }, []);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const baseUrl = "http://localhost:8085";

  const sendEmail = async () => {
    const dataToSend = {
      email: receiverEmail, // Use receiverEmail instead of email state
      subject: subject,
      message: message,
    };

    try {
      const response = await axios.post(`${baseUrl}/email/sendEmail`, dataToSend);
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        alert("Send Successfully !");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const addDummyValues = () => {
    setEmail("dummy@example.com");
    setSubject("Dummy Subject");
    setMessage("This is a dummy message.");
  };

  const fetchEmployeeManagers = async () => {
    try {
      const response = await axios.get("http://localhost:8085/api/v1/auth/admin/roles");
      const employeeManagers = response.data.usersRole2.filter((user) => user.role === 2);
      setUserManagers(employeeManagers);
    } catch (error) {
      console.error("Error fetching employee managers:", error);
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-6">
          <div className="container mt-5">
            <form>
              <div className="mb-3">
                <label className="form-label">Select Receiver's Email</label>
                <select
                  className="form-select"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                >
                  <option value="">Select Receiver</option>
                  {userManagers.map((manager) => (
                    <option key={manager._id} value={manager.email}>
                      {manager.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the subject here..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  placeholder="Enter your message here..."
                  value={message || transcript}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => SpeechRecognition.startListening()}
                >
                  Start Listening
                </button>
                {listening ? (
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      SpeechRecognition.stopListening();
                      resetTranscript();
                    }}
                  >
                    Stop Listening
                  </button>
                ) : null}
              </div>
              <button type="button" className="btn btn-primary" onClick={sendEmail}>
                Send Email
              </button>
              <button type="button" className="btn btn-secondary ms-2" onClick={addDummyValues}>
                Add Dummy Values
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-3">
          <div className="container mt-5">
            <h4>Speech Transcript</h4>
            <p>{transcript}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
