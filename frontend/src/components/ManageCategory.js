import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const ManageCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); // To handle editing a category

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem('token');
      if (editingCategory) {
        // Edit category
        const response = await axios.put(
          `http://localhost:5000/api/categories/${editingCategory._id}`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(
          categories.map((category) =>
            category._id === editingCategory._id ? response.data : category
          )
        );
      } else {
        // Create new category
        const response = await axios.post(
          "http://localhost:5000/api/categories",
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories([...categories, response.data]);
      }
      setCategoryName(""); // Clear the input field after submit
      setEditingCategory(null); // Reset editing state
    } catch (error) {
      console.error("Error creating/editing category", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name); // Set the input value to the category being edited
  };

  const handleDelete = async (categoryId) => {
    try {
      let token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((category) => category._id !== categoryId));
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  // Columns definition for DataTable
  const columns = [
    {
      name: 'Category Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button onClick={() => handleEdit(row)}>Edit</button>
          <button onClick={() => handleDelete(row._id)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>{editingCategory ? "Edit Category" : "Create New Category"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Category Name:
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </label>
        <button type="submit">{editingCategory ? "Update Category" : "Create Category"}</button>
      </form>

      <h3>Categories List</h3>
      <DataTable
        columns={columns}
        data={categories}
        pagination
        paginationPerPage={5}  // Number of rows per page
        paginationRowsPerPageOptions={[5, 10, 20]} // Page size options
        highlightOnHover
        responsive
      />
    </div>
  );
};

export default ManageCategories;
