import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
// import Sidebar from "./components/Sidebar"
import Home from "./pages/Home"
import Invoicelist from "./components/Invoicelist"
// import Savepdf from "./components/Savepdf"
import Stocks from "./components/Stocks"
import Invoiceform from "./components/Invoiceform"
const App = () => {
  return (
    <div>
        <Router>
         
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/list" element={<Invoicelist/>}/>
            <Route path="/stock" element={<Stocks/>}/>
            <Route path='/form' element={<Invoiceform/>}/>
            <Route path="/form/:id" element={<Invoiceform/>} />
          </Routes>
        </Router>
        {/* <Invoiceform/> */}
    </div>
  )
}

export default App