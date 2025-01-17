import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getinvoice, deletedinvoice,genpdf } from "../services/api";
import Printer from '../assets/img/printer.svg'
const Invoicelist = () => {
  const [invoicedata, setInvoice] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");

  const navigate = useNavigate();

  const fetchinvoice = async () => {
    try {
      const { data } = await getinvoice();
      setInvoice(data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deletedinvoice(id);
        fetchinvoice(); // Refresh the list
        alert("Invoice deleted successfully.");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        alert("Failed to delete invoice. Please try again.");
      }
    }
  };
  const handleEdit = (id) => {
    const selectedInvoice = invoicedata.find((invoice) => invoice._id === id);
    if (selectedInvoice) {
      navigate(`/form/${id}`, { state: selectedInvoice });
    }
  };
  const handlePrint = async (id) => {
    try {
        const { data } = await genpdf(id);
        const pdfUrl = `${import.meta.env.VITE_API || 'http://localhost:5000'}${data.pdfPath}`;
        
        // Open the PDF in a new tab
        window.open(pdfUrl, '_blank');
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF. Please try again.");
    }
};

const handlePreview = async (id) => {
    try {
        const { data } = await genpdf(id);
        const pdfUrl = `${import.meta.env.VITE_API || 'http://localhost:5000'}${data.pdfPath}`;
        
        // Open the PDF in a modal or preview it
        setPdfPreviewUrl(pdfUrl); // Assuming a state to manage preview URL
        setShowPreview(true); // Show the modal
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF. Please try again.");
    }
};


  useEffect(() => {
    fetchinvoice();
  }, []);

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="bg-gray-100 flex-1 p-6">
          <Link to="/form">
            <div className="flex w-[8vw] p-2 rounded-lg bg-blue-500 gap-1">
              <div className="text-white">+</div>
              <div className="cursor-pointer text-white">Add Invoice</div>
            </div>
          </Link>
          <table className="w-full bg-white rounded-lg shadow overflow-hidden mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Grand Total</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoicedata.map((value, index) => (
                <tr key={value._id} className="border-b">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{value.date}</td>
                  <td className="p-3">{value.customername}</td>
                  <td className="p-3">₹{value.grandtotal.toFixed(2)}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(value._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(value._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
    onClick={() => handlePreview(value._id)}
    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
>
    Print
</button>
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
        </div>
        
        {showPreview && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[80%] h-[90%] relative">
            <iframe
                src={pdfPreviewUrl}
                title="PDF Preview"
                className="w-full h-full"
            ></iframe>
            <div className="absolute top-2 right-2 flex gap-2">
                <button
                    onClick={() => setShowPreview(false)}
                    className="text-white text-xl py-2 font-bold bg-red-500 px-2"
                >
                   X 
                </button>
                
        
            </div>
        </div>
    </div>
)}

      </div>
    </div>
    
  );
};

export default Invoicelist;
