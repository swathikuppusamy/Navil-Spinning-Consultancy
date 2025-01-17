import React, { useEffect, useState } from 'react';
import { addinvoice, editinvoice } from '../services/api';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Invoiceform = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Capture invoice ID for editing
  const [isEdit, setIsEdit] = useState(false); // Check if it's an edit form

  const handleback = () => {
    navigate('/list');
  };

  const [items, setItems] = useState([
    {
      productname: '',
      unitprice: 0,
      unit: 'PCS',
      quantity: 1,
      totalprice: 0,
      gstpercent: 0,
      discount: 0,
      netamount: 0,
    },
  ]);

  const [invoiceDetails, setInvoiceDetails] = useState({
    customername: '',
    customerdetails: '',
    date: new Date().toISOString().split('T')[0],
    subtotal: 0,
    totalgst: 0,
    totaldiscount: 0,
    grandtotal: 0,
  });

  // Populate form if editing an invoice
  useEffect(() => {
    if (id && location.state) {
      const { customername, customerdetails, date, items: stateItems, ...totals } = location.state;
      setInvoiceDetails({ customername, customerdetails, date, ...totals });
      setItems(stateItems || items);
      setIsEdit(true);
    }
  }, [id, location.state]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (['quantity', 'unitprice', 'discount', 'gstpercent'].includes(field)) {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitprice = parseFloat(newItems[index].unitprice) || 0;
      const discount = parseFloat(newItems[index].discount) || 0;
      const gstpercent = parseFloat(newItems[index].gstpercent) || 0;

      const totalprice = quantity * unitprice;
      const discountAmount = (totalprice * discount) / 100;
      const taxableAmount = totalprice - discountAmount;
      const gstAmount = (taxableAmount * gstpercent) / 100;

      newItems[index].totalprice = totalprice;
      newItems[index].netamount = taxableAmount + gstAmount;
    }

    setItems(newItems);
    calculateTotals(newItems);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        productname: '',
        unitprice: 0,
        unit: 'PCS',
        quantity: 1,
        totalprice: 0,
        gstpercent: 0,
        discount: 0,
        netamount: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (updatedItems = items) => {
    const subtotal = updatedItems.reduce((acc, item) => acc + (item.totalprice || 0), 0);
    const totalgst = updatedItems.reduce(
      (acc, item) => acc + ((item.totalprice - (item.totalprice * item.discount) / 100) * item.gstpercent) / 100,
      0
    );
    const totaldiscount = updatedItems.reduce((acc, item) => acc + (item.totalprice * item.discount) / 100, 0);
    const grandtotal = subtotal - totaldiscount + totalgst;

    setInvoiceDetails((prev) => ({
      ...prev,
      subtotal,
      totalgst,
      totaldiscount,
      grandtotal,
    }));
  };

  const handleSubmit = async () => {
    const data = {
      ...invoiceDetails,
      items,
    };

    try {
      if (isEdit) {
        await editinvoice(id, data);
        alert('Invoice updated successfully!');
      } else {
        await addinvoice(data);
        alert('Invoice saved successfully!');
      }
      navigate('/list');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <button
        onClick={handleback}
        className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600 focus:ring-2 focus:ring-red-400"
      >
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        {isEdit ? 'Edit Invoice' : 'Add Invoice'}
      </h2>

      {/* Customer Details */}
      <div className="grid grid-cols-2 gap-8 mb-6 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="Customer Name"
          value={invoiceDetails.customername}
          onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customername: e.target.value })}
          className="border p-3 rounded w-full bg-gray-100 shadow-inner focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Customer Details"
          value={invoiceDetails.customerdetails}
          onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customerdetails: e.target.value })}
          className="border p-3 rounded w-full bg-gray-100 shadow-inner focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={invoiceDetails.date}
          onChange={(e) => setInvoiceDetails({ ...invoiceDetails, date: e.target.value })}
          className="border p-3 rounded w-full bg-gray-100 shadow-inner focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <tr>
            <th className="border p-4 text-left">Product Name</th>
            <th className="border p-4 text-left">Quantity</th>
            <th className="border p-4 text-left">Price/Unit</th>
            <th className="border p-4 text-left">Unit</th>
            <th className="border p-4 text-left">Discount (%)</th>
            <th className="border p-4 text-left">GST (%)</th>
            <th className="border p-4 text-left">Net Amount</th>
            <th className="border p-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="even:bg-gray-50">
              <td className="border p-4">
                <input
                  type="text"
                  value={item.productname}
                  onChange={(e) => handleItemChange(index, 'productname', e.target.value)}
                  className="border p-2 rounded w-full bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
              </td>
              <td className="border p-4">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="border p-2 rounded w-full bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
              </td>
              <td className="border p-4">
                <input
                  type="number"
                  value={item.unitprice}
                  onChange={(e) => handleItemChange(index, 'unitprice', e.target.value)}
                  className="border p-2 rounded w-full bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
              </td>
              <td className="border p-4">
                <select
                  value={item.unit}
                  onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                  className="border p-2 rounded w-full bg-gray-100 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="PCS">PCS</option>
                  <option value="KG">KG</option>
                  <option value="L">L</option>
                </select>
              </td>
              <td className="border p-4">
                <input
                  type="number"
                  value={item.discount}
                  onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                  className="border p-2 rounded w-full bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
              </td>
              <td className="border p-4">
                <input
                  type="number"
                  value={item.gstpercent}
                  onChange={(e) => handleItemChange(index, 'gstpercent', e.target.value)}
                  className="border p-2 rounded w-full bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
              </td>
              <td className="border p-4 text-gray-800">₹{item.netamount.toFixed(2)}</td>
              <td className="border p-4">
                <button
                  onClick={() => removeRow(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addRow}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 mb-6"
      >
        Add Row
      </button>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
        <div>
          <h4 className="font-bold text-gray-700 mb-4">Summary</h4>
          <p className="text-gray-600 mb-2">Subtotal: <span className="font-bold text-gray-800">₹{invoiceDetails.subtotal.toFixed(2)}</span></p>
          <p className="text-gray-600 mb-2">Total GST: <span className="font-bold text-gray-800">₹{invoiceDetails.totalgst.toFixed(2)}</span></p>
          <p className="text-gray-600 mb-2">Total Discount: <span className="font-bold text-gray-800">₹{invoiceDetails.totaldiscount.toFixed(2)}</span></p>
          <p className="text-gray-600 mb-2">Grand Total: <span className="font-bold text-gray-800">₹{invoiceDetails.grandtotal.toFixed(2)}</span></p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-1 justify-end text-right mt-6 ">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 focus:ring-2 focus:ring-green-400"
        >
          {isEdit ? 'Update Invoice' : 'Save Invoice'}
        </button>
      </div>
    </div>
  );
};

export default Invoiceform;
