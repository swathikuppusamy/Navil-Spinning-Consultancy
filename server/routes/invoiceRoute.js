const PDFDocument=require('pdfkit');
const puppeteer=require('puppeteer')
const invoice=require('../models/invoiceModel');
const fs=require('fs');
const path=require('path');
const express=require('express')
const router=express.Router();
const template=require('../templates/invoicetemplate');
const { error } = require('console');


function calculateInvoiceData(invoiceData) {
    let subtotal = 0;
    let totalGst = 0;
    let totalDiscount = 0;

    invoiceData.items.forEach(item => {
        item.totalprice = item.unitprice * item.quantity;
        item.netamount = item.totalprice;

        if (item.gstpercent) {
            const gstAmount = (item.gstpercent / 100) * item.totalprice;
            totalGst += gstAmount;
            item.netamount += gstAmount;
        }

        if (item.discount) {
            totalDiscount += item.discount;
            item.netamount -= item.discount;
        }

        subtotal += item.totalprice;
    });

    const grandTotal = subtotal + totalGst - totalDiscount;

    return { subtotal, totalGst, totalDiscount, grandTotal };
}

router.post('/invoices',async(req,res)=>{
    try{
        const invoiceData = req.body;
        const { subtotal, totalGst, totalDiscount, grandTotal } = calculateInvoiceData(invoiceData);

        invoiceData.subtotal = subtotal;
        invoiceData.totalgst = totalGst;
        invoiceData.totaldiscount = totalDiscount;
        invoiceData.grandtotal = grandTotal;

        const newinvoice = new invoice(invoiceData);
        await newinvoice.save();
        res.status(201).json(newinvoice)
    }
    catch(error)
    {
        res.status(500).json({message:error.message})
    }
});

router.get('/invoices',async(req,res)=>{
    try{
        const fetcheddata=await invoice.find()
        res.status(200).json(fetcheddata)
    }
    catch(error)
    {
        res.status(500).json({message:error.message})
    }
})



router.put('/invoices/:id',async(req,res)=>
{
    try{
        const invoiceData = req.body;
        const { subtotal, totalGst, totalDiscount, grandTotal } = calculateInvoiceData(invoiceData);

        invoiceData.subtotal = subtotal;
        invoiceData.totalgst = totalGst;
        invoiceData.totaldiscount = totalDiscount;
        invoiceData.grandtotal = grandTotal;

        const updatedinvoice = await invoice.findByIdAndUpdate(req.params.id, invoiceData, { new: true });
        if(!updatedinvoice) return res.status(404).json({message:'Invoice not found'});
        res.status(200).json(updatedinvoice)
    }
    catch(error)
    {
        res.status(500).json({message:error.message})
    }
})

router.delete('/invoices/:id',async(req,res)=>{
    try{
        const deleteddata=await invoice.findByIdAndDelete(req.params.id)
        if(!deleteddata) return res.status(404).json({message:'Invoice not found'})
        res.status(200).json({message:'Invoice deleted successfully'})

    }
    catch(error)
    {
        res.status(500).json({message:error.message})
    }
})
router.get('/invoices/:id',async(req,res)=>{
    try{
        const specificdata=await invoice.findById(req.params.id)
        if(!specificdata) return res.status(404).json({message:'Invoice not found'})
        res.status(200).json(specificdata)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

router.get('/invoices/:id/pdf', async (req, res) => {
    try {
        const invoicepdf = await invoice.findById(req.params.id);
        if (!invoicepdf) return res.status(404).json({ message: 'Invoice not found' });

        const invoiceHTML = template(invoicepdf);
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
        });
        const page = await browser.newPage();
        await page.setContent(invoiceHTML);
        const filename = `invoice-${invoicepdf._id}.pdf`;
        const pdfPath = path.join(__dirname, `../pdfs/${filename}`);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
        });
        await browser.close();

        // Return the file path relative to the frontend
        const publicPath = `/pdfs/${filename}`;
        res.status(200).json({ message: 'PDF generated successfully', pdfPath: publicPath });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports=router
