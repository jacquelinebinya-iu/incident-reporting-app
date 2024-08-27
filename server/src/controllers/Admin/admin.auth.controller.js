import 'dotenv/config';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AdminUser } from '../../models/admin.model.js';

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AdminUser.findOne({
      where: {
        email: email,
      },
    });

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

export { loginController, logoutController };
