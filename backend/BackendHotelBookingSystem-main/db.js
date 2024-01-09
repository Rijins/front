const mongoose=require("mongoose")
var mongoUrl="mongodb+srv://admin:P4assw0rd@cluster0.jf0hfdi.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(mongoUrl)
.then(()=>{
    console.log("Database Connected")

})

.catch(err =>
    {
        console.log(err)
    })

    module.exports=mongoose