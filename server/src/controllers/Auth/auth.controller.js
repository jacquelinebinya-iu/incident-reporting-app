import 'dotenv/config';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../../models/user.model.js';

const registerController = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({
        success: false,
        errorMessage: 'All fields required',
      });
    }

    const duplicateAccount = await User.findOne({
      where: { email },
    });

    if (duplicateAccount) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Account already exists',
      });
    }

    const user = await User.create({
      name,
      surname,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
    });

    console.log('USER', user);

    if (user) {
      const token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return res.status(201).json({
        success: true,
        data: user.get(),
        token,
      });
    } else {
      return res.status(409).json({
        success: false,
        errorMessage: 'Incorrect details',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        errorMessage: 'Your account is blocked contact support for further enquiries',
      });
    }

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        const accessToken = jwt.sign(
          { user: { id: user.id, role: user.role } },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return res.json({
          success: true,
          token: accessToken,
          data: user,
        });
      } else {
        return res.status(401).json({
          success: false,
          errorMessage: 'Incorrect password',
        });
      }
    }
    return res.status(401).json({
      success: false,
      errorMessage: 'Account does not exist',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later',
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        errorMessage: 'All fields required',
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        errorMessage: 'The account is not found',
      });
    }

    await user.update({
      password: await bcrypt.hash(password, 10),
    });

    await user.save();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies['refreshToken'];

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      await User.update(
        { token: null },
        {
          where: {
            id: decoded.user.id,
          },
        }
      );
    }

    res.clearCookie('refreshToken');

    return res.cookie('refreshToken', '', { httpOnly: true, sameSite: 'strict' }).status(204).json({
      success: true,
    });
  } catch (error) {
    console.log('LOGOUT_ERROR', error);
    res.status(500).json({
      success: false,
    });
  }
};

export { loginController, logoutController, registerController, resetPasswordController };
