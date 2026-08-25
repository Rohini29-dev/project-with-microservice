const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const redis = require('../db/redis')
// const {publishToQueue} = require('../borker/borker')


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

// await Promise.all([

//   publishToQueue('AUTH_NOTIFICATION.USER_CREATED',{
//     id:user.id,
//     username:user.username,
//     email:user.email,
//     fullName:user.fullName
//   }),

//   publishToQueue('AUTH_SELLER.USER_CREATED',user)

  
// ])



const token = jwt.sign({
    id:user._id,
    username:user.username,
    email:user.email,
    role: role || "user"

},process.env.JWT_SECRET,{expiresIn:'2d'})


res.cookie("token",token,{httpOnly:true,
    secure:true,
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
console.log("User Role:", user.role);
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
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "user login successfully",
      user: {
    id: user._id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    addresses: user.addresses
  }
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
    console.log("ME ERROR 👉", error); // 
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
     console.log("ME ERROR 👉", error);
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
      console.log("ME ERROR 👉", error); // 👈 ADD THIS
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
    console.log("ADD ADDRESS ERROR 👉", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
}


async function updateCurrentUser(req, res) {
  try {
    const id = req.user.id;

    const {
      username,
      email,
      fullName
    } = req.body;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    // Check username already exists
    if (username && username !== user.username) {
      const usernameExists = await userModel.findOne({
        username,
        _id: { $ne: id }
      });

      if (usernameExists) {
        return res.status(409).json({
          message: "username already exists"
        });
      }

      user.username = username;
    }

    // Check email already exists
    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({
        email,
        _id: { $ne: id }
      });

      if (emailExists) {
        return res.status(409).json({
          message: "email already exists"
        });
      }

      user.email = email;
    }

    // Update full name
    if (fullName) {
      if (fullName.firstName !== undefined) {
        user.fullName.firstName = fullName.firstName;
      }

      if (fullName.lastName !== undefined) {
        user.fullName.lastName = fullName.lastName;
      }
    }

    await user.save();

    // Generate new token because
    // username/email may have changed
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        addresses: user.addresses
      }
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR 👉", error);

    return res.status(500).json({
      message: "internal server error"
    });
  }
}

async function changePassword(req, res) {
  try {
    const userId = req.user.id;

    const {
      currentPassword,
      newPassword
    } = req.body;


    // Check required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }


    // Find user
    const user = await userModel
      .findById(userId)
      .select("+password");


    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    // Check current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );


    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }


    // Check new password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password"
      });
    }


    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );


    // Update password
    user.password = hashedPassword;

    await user.save();


    return res.status(200).json({
      message: "Password changed successfully"
    });


  } catch (error) {

    console.log(
      "CHANGE PASSWORD ERROR 👉",
      error
    );

    return res.status(500).json({
      message: "Internal server error"
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



module.exports = {
    registerUserController,
    loginUserController,
    getCurrentUser,
    logOutUser,
    getUserAddress,
addUserAddress,
deleteUserAddress,
updateCurrentUser,
changePassword
}