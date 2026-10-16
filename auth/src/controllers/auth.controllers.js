const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const redis = require("../db/redis");
const { publishToQueue } = require("../borker/borker");

// =========================================
// REGISTER USER
// =========================================

async function registerUserController(req, res) {
  try {
    const {
      email,
      username,
      password,
      fullName: { firstName, lastName },
      role,
      addresses,
    } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists) {
      return res.status(409).json({
        message: "username and email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
      fullName: {
        firstName,
        lastName,
      },
      role,
    });

    await Promise.all([
      publishToQueue("AUTH_NOTIFICATION.USER_CREATED", {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      }),

      publishToQueue("AUTH_SELLER.USER_CREATED", user),
    ]);

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: role || "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User Registerd successfilly",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("error-------->", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =========================================
// LOGIN USER
// =========================================

async function loginUserController(req, res) {
  try {
    const { email, username, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "password is Invalid",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "user login successfully",
      fullName:user.fullName,
      username:user.username,
      email:user.email,
      role:user.role,
      _id:user._id,
      addresses:user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
}

// =========================================
// GET CURRENT USER
// =========================================

async function getCurrentUser(req, res) {
  try {
    res.status(200).json({
      // message: "user fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.log("ERROR ", error);

    res.status(500).json({
      message: "internal server error",
    });
  }
}

// =========================================
// LOGOUT USER
// =========================================

async function logOutUser(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
      await redis.set(
        `blacklist:${token}`,
        "token",
        "EX",
        24 * 60 * 60
      );
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      message: "user logout sucessfully",
    });
  } catch (error) {
    console.log(" ERROR", error);

    res.status(500).json({
      message: "internal server error",
    });
  }
}

// =========================================
// GET USER ADDRESS
// =========================================

async function getUserAddress(req, res) {
  try {
    const id = req.user.id;

    const user = await userModel
      .findById(id)
      .select("addresses");

    if (!user) {
      return res.status(404).json({
        message: "user not founded",
      });
    }

    res.status(200).json({
      message: "user addresses fetched successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("ERROR ", error);

    res.status(500).json({
      message: "internal server error",
    });
  }
}

// =========================================
// ADD USER ADDRESS
// =========================================

async function addUserAddress(req, res) {
  try {
    const id = req.user.id;

    const {
      street,
      city,
      state,
      zip,
      country,
      isDefult,
    } = req.body;

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        $push: {
          addresses: {
            street,
            city,
            state,
            zip,
            country,
            isDefult,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      message: "user address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("ADD ADDRESS ERROR ", error);

    res.status(500).json({
      message: "internal server error",
    });
  }
}

// =========================================
// DELETE USER ADDRESS
// =========================================

async function deleteUserAddress(req, res) {
  try {
    const id = req.user.id;
    const { addressId } = req.params;

    const isAddressExists = await userModel.findOne({
      _id: id,
      "addresses._id": addressId,
    });

    if (!isAddressExists) {
      return res.status(404).json({
        message: "user address not found",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          addresses: {
            _id: addressId,
          },
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const stillExists = user.addresses.some(
      (addr) => addr._id.toString() === addressId
    );

    if (stillExists) {
      return res.status(500).json({
        message: "failed to delete address",
      });
    }

    return res.status(200).json({
      message: "user address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
    });
  }
}

// =========================================
// GOOGLE AUTH CALLBACK
// =========================================

async function googleAuthCallback(req, res) {
  const user = req.user;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [
      {
        email: user.emails[0].value,
      },
      {
        googleId: user.id,
      },
    ],
  });

  if (isUserAlreadyExist) {
    const token = jwt.sign(
      {
        id: isUserAlreadyExist.id,
        email: isUserAlreadyExist.email,
        fullName: isUserAlreadyExist.fullName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.cookie("token", token);

    if (user.role === "artist") {
      return res.redirect(
        "http://localhost:5173/artist/dashboard"
      );
    }

    if (isUserAlreadyExist === "artist") {
      return res.redirect(
        "http://localhost:5173/artist/dashboard"
      );
    }

    return res.redirect("http://localhost:5173");
  }

  const newUser = await userModel.create({
    googleId: user.id,
    email: user.emails[0].value,
    fullName: {
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    },
  });

  await publishToQueue("user_create", {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role,
  });

  const token = jwt.sign(
    {
      id: newUser.id,
      role: newUser.role,
      fullName: newUser.fullName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );

  res.cookie("token", token);

  res.redirect("http://localhost:5173");
}

async function updateCurrentUser(req, res) {
  try {
    const userId = req.user.id;

    const {
      username,
      email,
      fullName,
    } = req.body;


    // ================= FIND USER =================

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // ================= FULL NAME =================

    const updatedFullName = {
      firstName:
        fullName?.firstName?.trim() ||
        existingUser.fullName?.firstName,

      lastName:
        fullName?.lastName?.trim() ||
        existingUser.fullName?.lastName,
    };


    // ================= VALIDATION =================

    if (!updatedFullName.firstName) {
      return res.status(400).json({
        message: "First name is required",
      });
    }


    if (!updatedFullName.lastName) {
      return res.status(400).json({
        message: "Last name is required",
      });
    }


    // ================= UPDATE =================

    const user = await userModel
      .findByIdAndUpdate(
        userId,

        {
          username:
            username?.trim() ||
            existingUser.username,

          email:
            email?.trim() ||
            existingUser.email,

          fullName: updatedFullName,
        },

        {
          new: true,
          runValidators: true,
        }
      )
      .select("-password");


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // ================= RESPONSE =================

    return res.status(200).json({
      message: "Profile updated successfully",

      user: {
        _id: user._id,

        username: user.username,

        email: user.email,

        fullName: user.fullName,

        role: user.role,

        addresses: user.addresses,
      },
    });


  } catch (error) {

    console.error(
      "UPDATE USER ERROR =>",
      error
    );


    return res.status(500).json({
      message: "Unable to update profile",

      error: error.message,
    });
  }
}


// =========================================
// CHANGE PASSWORD
// =========================================

async function changePassword(req, res) {
  try {
    const userId = req.user.id;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    // ================= VALIDATION =================

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password",
      });
    }

    // ================= FIND USER =================

    const user = await userModel
      .findById(userId)
      .select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ================= CHECK CURRENT PASSWORD =================

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // ================= HASH NEW PASSWORD =================

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // ================= UPDATE PASSWORD =================

    user.password = hashedPassword;

    await user.save();

    // ================= RESPONSE =================

    return res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error(
      "CHANGE PASSWORD ERROR =>",
      error
    );

    return res.status(500).json({
      message: "Unable to change password",
    });
  }
}



// =========================================
// EXPORTS
// =========================================

module.exports = {
  registerUserController,
  loginUserController,
  getCurrentUser,
  logOutUser,
  getUserAddress,
  addUserAddress,
  deleteUserAddress,
  googleAuthCallback,
  updateCurrentUser,
  changePassword
};