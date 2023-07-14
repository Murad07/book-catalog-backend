import { Request, Response } from 'express';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse } from './auth.interface';
import { AuthService } from './auth.service';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: others,
  });
});

// auth.controller.ts
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  // Verify the refresh token
  const decodedToken = jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh_secret as Secret
  );

  // Retrieve the user information from the refresh token
  const { _id, userEmail, role } = decodedToken;

  // Generate a new access token
  const accessToken = jwtHelpers.createToken(
    { _id, userEmail, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // Send the new access token in the response
  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'New access token generated successfully !',
    data: { accessToken },
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
};
