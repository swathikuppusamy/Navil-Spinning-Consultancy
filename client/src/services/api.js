import axios from 'axios'


const API=import.meta.env.VITE_API||'http://localhost:5000'

const getinvoice=()=>axios.get(`${API}/api/invoices`)
const getinvoicebyid=()=>axios.get(`${API}/api/invoices/${id}`)
const addinvoice=(invoicedata)=>axios.post(`${API}/api/invoices`,invoicedata)
const editinvoice=(id,editedinvoice)=>axios.put(`${API}/api/invoices/${id}`,editedinvoice)
const deletedinvoice=(id)=>axios.delete(`${API}/api/invoices/${id}`)
const genpdf = (id) => axios.get(`${API}/api/invoices/${id}/pdf`);
export { getinvoice, addinvoice, editinvoice, deletedinvoice, getinvoicebyid, genpdf };
