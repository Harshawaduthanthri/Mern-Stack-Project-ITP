import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { Button, Input } from "antd";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import moment from 'moment';
import MostBoughtItemsChart from "./Contactreport.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AllContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportMode, setReportMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [report, setReport] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            fetchContacts();
        } else {
            const filteredContacts = contacts.filter(contact =>
                contact.queryType.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setContacts(filteredContacts);
        }
    }, [searchTerm, contacts]);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const response = await axios.get("/api/v1/getcontact/report");
            setReport(response.data);
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await axios.get("/api/v1/getcontact/get-contact");
            setContacts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            setLoading(false);
        }
    };

    const handleCheckboxChange = (contactId) => {
        setSelectedContacts(prevSelectedContacts => {
            if (prevSelectedContacts.includes(contactId)) {
                return prevSelectedContacts;
            } else {
                return [...prevSelectedContacts, contactId];
            }
        });
    };

    const handleDelete = async (contactId) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this contact?");
            if (!confirmed) {
                return;
            }

            await axios.delete(`/api/v1/getcontact/Deletecontact/${contactId}`);
            setContacts(prevContacts =>
                prevContacts.filter(contact => contact._id !== contactId)
            );
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            // Capture the entire component as an image
            const chartCanvas = await html2canvas(chartRef.current);

            // Create a PDF document
            const pdf = new jsPDF();

            // Add the image to the PDF
            pdf.addImage(chartCanvas.toDataURL("image/png"), "PNG", 10, 10, 180, 100);

            // Save the PDF
            pdf.save("contact_report.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <Layout title={"Dashboard - All Users"}>
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>All Contacts</h1>
                        <div className="mb-3">
                            <Button onClick={() => setReportMode(false)}>View All Contacts</Button>
                            <Button onClick={() => setReportMode(true)}>View Contact Query Report</Button>
                            {reportMode && (
                                <Button onClick={handleDownloadPDF}>Download as PDF</Button>
                            )}
                        </div>
                        {!reportMode && (
                            <Input
                                placeholder="Search by query type"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-3"
                            />
                        )}
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                                {reportMode ? (
                                    <div>
                                        <h2>Inquiry summary according to the query type</h2>
                                        <ul>
                                            {report.map((item) => (
                                                <li key={item._id}>
                                                    {item._id}: {item.count}
                                                </li>
                                            ))}
                                        </ul>
                                        <div ref={chartRef} className="card mb-3 border border-primary rounded" style={{ backgroundColor: "#e8f5fe", maxWidth: "400px" }}>
                                            <div className="card-body">
                                                <h4 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}></h4>
                                                <div className="col-md-12">
                                                    <MostBoughtItemsChart />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <table className="table table-hover">
                                        <thead style={{ backgroundColor: "#d891ef" }}>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Query Type</th>
                                                <th>Message</th>
                                                <th>Date</th>
                                                <th>Respond</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                    {contacts
                                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort contacts by createdAt in descending order
                                                        .map((contact) => (
                                                            <tr key={contact._id}>
                                                                <td>{contact.name}</td>
                                                                <td>{contact.email}</td>
                                                                <td>{contact.queryType}</td>
                                                                <td>{contact.message}</td>
                                                                <td>{moment(contact.createdAt).format('MMMM DD, YYYY')}</td>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedContacts.includes(contact._id)}
                                                                        onChange={() => handleCheckboxChange(contact._id)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => handleDelete(contact._id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}

                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AllContacts;
//showContacts