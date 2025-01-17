const mongoose=require('mongoose')

const invoiceSchema = new mongoose.Schema(
    {
        customername : {type:String, required:true},
        customerdetails : {type:String,required:false},
        date :{type:Date,default:Date.now},
        items:[
            {
                productname :{type:String,required:true},
                unitprice :{type:Number,required:true},
                unit :{type:String,required:true},
                quantity :{type:Number,required:true},
                totalprice :{type:Number,required:true},
                gstpercent :{type:Number,required:false},
                discount:{type:Number,required:false},
                netamount:{type:Number,required:true}
            }
        ],
        subtotal:{type:Number,required:true},
        totalgst:{type:Number,required:false},
        totaldiscount:{type:Number,required:false},
        grandtotal:{type:Number,required:true}
    }
);

const invoice = mongoose.model('invoice',invoiceSchema)
module.exports=invoice