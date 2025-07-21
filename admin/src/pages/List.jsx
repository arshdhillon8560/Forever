import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        📦 All Products
      </h2>

      <div className="flex flex-col gap-2 rounded-lg overflow-hidden shadow border border-gray-200">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] bg-gray-100 px-4 py-2 text-gray-600 font-medium text-sm border-b border-gray-200 text-center">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Action</span>
        </div>

        {/* Product Rows */}
        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center text-center gap-4 px-4 py-3 hover:bg-gray-50 transition-all border-b text-sm border-gray-200"
          >
            <div className="flex justify-center">
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-14 h-14 object-cover rounded-md border border-gray-200"
              />
            </div>
            <p className="font-medium text-gray-800 truncate">{item.name}</p>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-gray-700 font-semibold">{currency}{item.price}</p>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-pink-500 hover:text-pink-700 font-bold text-xl transition mr-2"
              title="Remove product"
              aria-label="Remove product"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No products found.</p>
      )}
    </div>
  );
};

export default List;
