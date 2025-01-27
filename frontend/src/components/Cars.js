import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DOMPurify from "dompurify"; // Import DOMPurify
import "../style.css";

const Cars = () => {
  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // To store total pages
  const [currentPage, setCurrentPage] = useState(1); // To track the current page
  const [carDetails, setCarDetails] = useState({
    model: "",
    color: "",
    registrationNo: "",
    category: "",
  });
  const [editingCar, setEditingCar] = useState(null); // Track car being edited
  let token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    };
    const fetchCars = async (page = 1, limit = 10) => {
      const response = await axios.get("http://localhost:5000/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, limit: 10 }, // Send page and limit as query params
      });
      setCars(response.data.cars);
      setTotalPages(response.data.totalPages);
    };

    fetchCategories();
    fetchCars(1, 10);
  }, []);

  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let response;
      if (editingCar) {
        // Edit existing car
        response = await axios.put(
          `http://localhost:5000/api/cars/${editingCar._id}`,
          carDetails,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCars(
          cars.map((car) => (car._id === editingCar._id ? response.data : car))
        );
        window.location.reload();
      } else {
        // Add new car
        response = await axios.post(
          "http://localhost:5000/api/cars",
          carDetails,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCars([...cars, response.data]);
      }
      setCarDetails({ model: "", color: "", registrationNo: "", category: "" });
      setEditingCar(null);
    } catch (err) {
      console.error("Error creating/editing car", err);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setCarDetails({
      model: car.model,
      color: car.color,
      registrationNo: car.registrationNo,
      category: car.category._id,
    });
  };

  const handleDelete = async (carId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(cars.filter((car) => car._id !== carId));
      window.location.reload();
    } catch (err) {
      console.error("Error deleting car", err);
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      name: "Model",
      selector: (row) => DOMPurify.sanitize(row.model), // Sanitize the car model
      sortable: true,
    },
    {
      name: "Color",
      selector: (row) => DOMPurify.sanitize(row.color), // Sanitize the car color
      sortable: true,
    },
    {
      name: "Registration No",
      selector: (row) => DOMPurify.sanitize(row.registrationNo), // Sanitize registration number
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) =>
        row.category && row.category.name
          ? DOMPurify.sanitize(row.category.name) // Sanitize the category name
          : "No Category",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button onClick={() => handleEdit(row)}>Edit</button>
          <button onClick={() => handleDelete(row._id)}>Delete</button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the page when user navigates
  };

  return (
    <div>
      <h2>Manage Cars</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="model"
          value={carDetails.model}
          onChange={handleChange}
          placeholder="Car Model"
          required
        />
        <input
          type="text"
          name="color"
          value={carDetails.color}
          onChange={handleChange}
          placeholder="Car Color"
          required
        />
        <input
          type="text"
          name="registrationNo"
          value={carDetails.registrationNo}
          onChange={handleChange}
          placeholder="Registration No"
          required
        />
        <select
          name="category"
          value={carDetails.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {DOMPurify.sanitize(category.name)} {/* Sanitize category name */}
            </option>
          ))}
        </select>
        <button type="submit">{editingCar ? "Update Car" : "Add Car"}</button>
      </form>

      <h3>Registered Cars</h3>
      <DataTable
        title="Registered Cars"
        columns={columns}
        data={cars}
        pagination
        paginationServer
        paginationTotalRows={totalPages * 10} // Total number of rows to paginate
        onChangePage={handlePageChange} // Handle page change
        currentPage={currentPage} // Current page for pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default Cars;
