const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const redis = require('../db/redis')
const {publishToQueue} = require('../borker/borker')


async function registerUserController(req,res) {
    try {
        
const {email,username,password,fullName:{firstName,lastName},role,addresses} = req.body

const isUserAlreadyExists = await userModel.findOne({
    $or:[{email},{username}]
})

if (isUserAlreadyExists) {
  return res.status(409).json({
    message: "username and email already exists"
  });
}
const hash = await bcrypt.hash(password,10)

const user = await userModel.create({
    username,
    email,
    password:hash,
    fullName:{firstName,lastName},
    role
})

await Promise.all([

  publishToQueue('AUTH_NOTIFICATION.USER_CREATED',{
    id:user.id,
    username:user.username,
    email:user.email,
    fullName:user.fullName
  }),

  publishToQueue('AUTH_SELLER.USER_CREATED',user)

  
])



const token = jwt.sign({
    id:user._id,
    username:user.username,
    email:user.email,
    role: role || "user"

},process.env.JWT_SECRET,{expiresIn:'2d'})


res.cookie("token",token,{httpOnly:true,
    secure:false,
    maxAge: 24 * 60 * 60 * 1000
})

res.status(201).json({
    message:'User Registerd successfilly',
    user:{
        id:user._id,
        username:user.username,
    email:user.email,
    fullName:user.fullName,
    role:user.role,
    addresses:user.addresses
    }
})


    } catch (error) {
        console.error('error-------->',error);
        
        return res.status(500).json({

            message:"Internal Server Error",

        })
    }
}

async function loginUserController(req, res) {
  try {
    const { email, username, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ email }, { username }]
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "password is Invalid" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "user login successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

async function getCurrentUser(req, res) {
  try {
    res.status(200).json({
      message: "user fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.log("ERROR ", error); 
    res.status(500).json({
      message: "internal server error",
    });
  }
}

async function logOutUser(req,res) {
    try {
        const token = req.cookies.token
        if(token){
            await redis.set(`blacklist:${token}`,"token",'EX',24*60*60)
        }

        res.clearCookie("token",{
            httpOnly:true,
            secure:true
        })

        return res.status(200).json({
            message:"user logout sucessfully"
        })
    } catch (error) {
     console.log(" ERROR", error);
    res.status(500).json({
      message: "internal server error",
    });
        
    }
  }


  async function getUserAddress(req,res) {
    try {

      const id = req.user.id

      const user = await userModel.findById(id).select('addresses')

      if(!user){
        return res.status(404).json({message:"user not founded"})
      }


      res.status(200).json({
         message: "user addresses fetched successfully",
  addresses: user.addresses
      })



    } catch (error) {
      console.log("ERROR ", error); 
    res.status(500).json({
      message: "internal server error",
    });
    }
  }

 async function addUserAddress(req, res) {
  try {
    const id = req.user.id;

    const { street, city, state, zip, country, isDefult } = req.body;

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        $push: {
          addresses: { street, city, state, zip, country, isDefult }
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    res.status(200).json({
      message: "user address added successfully",
      addresses: user.addresses
    });

  } catch (error) {
    console.log("ADD ADDRESS ERROR ", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

async function deleteUserAddress(req, res) {
  try {
    const id = req.user.id;
    const { addressId } = req.params;

    const isAddressExists = await userModel.findOne({
      _id: id,
      "addresses._id": addressId
    });

    if (!isAddressExists) {
      return res.status(404).json({
        message: "user address not found"
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          addresses: { _id: addressId }
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    const stillExists = user.addresses.some(
      addr => addr._id.toString() === addressId
    );

    if (stillExists) {
      return res.status(500).json({
        message: "failed to delete address"
      });
    }

    return res.status(200).json({
      message: "user address deleted successfully",
      addresses: user.addresses
    });

  } catch (error) {
    return res.status(500).json({
      message: "server error"
    });
  }
}


export async function googleAuthCallback(req,res) {
    const user = req.user
// console.log(user);




    const isUserAlreadyExist = await userModel.findOne({
        $or:[
            {email:user.emails[0].value},
            {googleId:user.id}
        ]
    })


    if(isUserAlreadyExist){
        const token = jwt.sign({
            id:isUserAlreadyExist.id,
            email:isUserAlreadyExist.email,
            fullName:isUserAlreadyExist.fullName
        },_config.JWT_SECRET,{expiresIn:'2d'})
 
        res.cookie('token',token)

        if(user.role === 'artist'){
            return res.redirect('http://localhost:5173/artist/dashboard')
        }

        if(isUserAlreadyExist === 'artist'){
        return redirect('http://localhost:5173/artist/dashboard')
    }

    return res.redirect('http://localhost:5173')

    }

    const newUser = await userModel.create({
        googleId:user.id,
        email:user.emails[0].value,
        fullName:{
            firstName:user.name.givenName,
            lastName:user.name.familyName
        }
    })

    await publishToQueue('user_create',{
        id:newUser.id,
        email:newUser.email,
        fullName:newUser.fullName,
        role:newUser.role
    })

    const token = jwt.sign({
        id:newUser.id,
        role:newUser.role,
        fullName:newUser.fullName
    },_config.JWT_SECRET,{expiresIn:'2d'})

    res.cookie('token',token)

    res.redirect('http://localhost:5173')

  

    

}


module.exports = {
    registerUserController,
    loginUserController,
    getCurrentUser,
    logOutUser,
    getUserAddress,
addUserAddress,
deleteUserAddress,
googleAuthCallback
}