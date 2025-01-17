import React from 'react';
import { FileText, Printer, BarChart2 } from 'lucide-react'; // Icons for the features
import Sidebar from "../components/Sidebar"; 
import shopBg from '../assets/img/shop bg.jpg';

const Home = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-gray-100 overflow-auto p-8">
        {/* Header with Background */}
        <div className="relative w-full h-[50vh] flex flex-col justify-center items-center text-center">
          <img 
            src={shopBg} 
            alt="Shop Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-80" />

          <div className="relative z-10 px-6">
            <h1 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg mb-2">
              M.S.Mani Rewindings & Electricals
            </h1>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
              Your reliable partner for exceptional electrical and rewinding services.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Manage Invoices */}
          <div className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <FileText className="text-blue-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Invoices</h3>
            <p className="text-gray-600 text-center">
              Create, update, and delete invoices easily to keep track of all your transactions.
            </p>
          </div>

          {/* Generate PDF */}
          <div className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <Printer className="text-blue-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Generate PDF</h3>
            <p className="text-gray-600 text-center">
              Generate and download professional invoice PDFs for your clients.
            </p>
          </div>

          {/* View Reports */}
          <div className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <BarChart2 className="text-blue-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">View Reports</h3>
            <p className="text-gray-600 text-center">
              Analyze financial data with detailed reports and gain insights into your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
