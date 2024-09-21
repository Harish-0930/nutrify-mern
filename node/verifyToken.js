const jwt=require('jsonwebtoken')
// middleware to verify token
function verifyToken(req,res,next){
    if(req.headers.authorization!==undefined){
        
    let token= req.headers.authorization.split(" ")[1]
    jwt.verify(token,"nutrifyapp",(err,data)=>{
        if(!err){
            next();
        }else{
            res.send({message:"Invalid token"})
        }
    })

    }else{
        res.send({message:"Please send a token"})
    }
   // res.send({message:"comming from middleware"})

}

module.exports=verifyToken