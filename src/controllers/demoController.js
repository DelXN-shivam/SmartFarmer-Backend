import logger from "../config/logger.js"
import { generateToken } from "../middleware/authentication.js"
import Demo from "../models/Demo.js"


export const demoRegister = async ( req , res , next) => {
    try{
        const body = req.body

        const existingDemo = await Demo.findOne({email : body.email})
        if(existingDemo){
            return res.status(500).json({
                message : "Demo already exists"
            })
        }

        const newDemo = await Demo.create(body)
        const token = generateToken({ id: newDemo._id, role: newDemo.role });

        if(!token){
            return res.json({
                error : 'error while creating token'
            })
        }

        res.json({
            Demo : newDemo,
            token
        } , 200)
        
    }   
    catch (err){
        console.error(err)
        next(err);
    }
}

export const demoGet = async ( req , res , next ) => {
    try {
        const demo = await Demo.findById(req.user.id).select('-password');

        if(!demo) {
            return res.status(500).json({
                error : "|Error while fetchin Demo"
            })
        }

        return res.status(200).json({
            message : "Demo found",
            Demo : demo
        })
    }
    catch (err) {
        logger.error("Get demo error" , err)
        console.log(err);
        next(err);
    }
}

export const demoUpdate =  async ( req , res , next) => {
    try {
        const demo = await Demo.findById(req.user.id);

    if(!demo){
        return res.json({
            message : "Error wjile fetching demo"
        } , 500)
    }

    const updateDemo = await Demo.findByIdAndUpdate(req.user.id , req.body , {
        new : true
    })

    const updatedDemo = await updateDemo.save()

    return res.json({
        message : "Demo updated",
        Demo : updatedDemo
    })
    }
    catch (err) {
        console.error(err),
        logger.error(err);
        next(err);
        return ;
    }
}