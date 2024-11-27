import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select, Modal } from "antd";
import { FaTrash, FaEye } from "react-icons/fa";
import jsPDF from "jspdf";

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "delivered",
    "cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [visible, setVisible] = useState(false); // State for controlling modal visibility
  const [selectedProducts, setSelectedProducts] = useState([]); // State to store selected products for modal
  const [selectedMonth, setSelectedMonth] = useState(""); // State to store selected month
  const [filteredOrders, setFilteredOrders] = useState([]); // State to store filtered orders by month
  const [successFilter, setSuccessFilter] = useState(""); // State to store success filter

  // Fetch orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.error("AxiosError:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Filter orders by month and success status
  useEffect(() => {
    let filtered = orders;
    if (selectedMonth !== "") {
      filtered = filtered.filter((order) =>
        moment(order.createAt).isSame(selectedMonth, "month")
      );
    }
    if (successFilter === "Success") {
      filtered = filtered.filter((order) => order.payment.success);
    } else if (successFilter === "Failed") {
      filtered = filtered.filter((order) => !order.payment.success);
    }
    setFilteredOrders(filtered);
  }, [selectedMonth, orders, successFilter]);

  // Function to handle order status change
  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  // Define handleRemove function
  const handleRemove = async (orderId) => {
    try {
      // Make an API call to delete the order
      await axios.delete(`/api/v1/auth/order-delete/${orderId}`);
      toast.success("Order deleted successfully");
      getOrders(); // Refresh the orders list after deletion
    } catch (error) {
      console.error(error);
      toast.error("Error deleting order");
    }
  };

  // Function to handle opening the modal and setting the selected products
  const handleOpenModal = (products) => {
    setSelectedProducts(products);
    setVisible(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setSelectedProducts([]);
    setVisible(false);
  };

  // Function to generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();

    // Add title and header row
    doc.setFontSize(20);
    doc.text("Order Report", 20, 20);

    doc.setFontSize(12);
    const headers = ["No.", "Buyer", "Status", "Date", "Payment", "Quantity"];
    const xCoordinates = [20, 40, 70, 110, 150, 190];
    let yOffset = 40;

    headers.forEach((header, index) => {
      doc.text(header, xCoordinates[index], yOffset);
    });

    // Iterate through the filtered orders and add details to the PDF
    filteredOrders.forEach((order, index) => {
      yOffset += 10;
      const row = [
        (index + 1).toString(),
        order.buyer.name,
        order.status,
        moment(order.createAt).format("YYYY-MM-DD"),
        order.payment.success ? "Success" : "Failed",
        order.products.length.toString(),
      ];
      row.forEach((data, idx) => {
        doc.text(data, xCoordinates[idx], yOffset);
      });
    });

    // Save the PDF
    doc.save(`order_report_${moment(selectedMonth).format("YYYY-MM")}.pdf`);
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="container-fluid m-3 p-3">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>

            {/* Dropdown to select month */}
            <Select
              defaultValue=""
              style={{ width: 120, marginBottom: 20 }}
              onChange={(value) => setSelectedMonth(value)}
            >
              <Option value="">All Months</Option>
              {moment.months().map((month, index) => (
                <Option key={index} value={moment().month(index).format("YYYY-MM")}>
                  {month}
                </Option>
              ))}
            </Select>

            {/* Dropdown to filter orders by success status */}
            <Select
              defaultValue=""
              style={{ width: 120, marginBottom: 20, marginLeft: 10 }}
              onChange={(value) => setSuccessFilter(value)}
            >
              <Option value="">All Orders</Option>
              <Option value="Success">Success Orders</Option>
              <Option value="Failed">Failed Orders</Option>
            </Select>

            {/* Generate Report button */}
            <button onClick={generateReport} className="btn btn-primary mb-3">
              Generate Report
            </button>

            {/* Orders Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead style={{ backgroundColor: "#007bff", color: "white" }}>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Status</th>
                    <th scope="col">Buyer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Remove</th>
                    <th scope="col">View Products</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o, i) => (
                    <tr key={o._id}>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                      <td>
                        <button className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit" style={{backgroundColor: '#ba2913', color: 'white'}} onClick={() => handleRemove(o._id)}>
                          <FaTrash />
                        </button>
                      </td>
                      <td>
                        <button className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit"  onClick={() => handleOpenModal(o?.products)}>
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to view products */}
      <Modal
        title="Products"
        visible={visible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div className="container">
          {selectedProducts.map((product) => (
            <div className="row mb-2 p-3 card flex-row" key={product._id}>
              <div className="col-md-4">
                <img
                  src={`/api/v1/product/product-photo/${product._id}`}
                  className="card-img-top"
                  alt={product.name}
                  width="100px"
                  height={"100px"}
                />
              </div>
              <div className="col-md-8">
                <p>{product.name}</p>
                <p>{product.description.substring(0, 30)}</p>
                <p>Price : {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </Layout>
  );
};

export default AdminOrders;
