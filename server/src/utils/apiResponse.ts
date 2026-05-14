import { Response } from 'express';

export const success = (
    res: Response,
    message: string,
    data: any = {},
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const error = (
    res: Response,
    message: string,
    statusCode: number = 400
) => {
    return res.status(statusCode).json({
        success: false,
        error: { message }
    })
}

// export const error = (res, message, statusCode = 400) => {
//     return res.status(statusCode).json({
//       success: false,
//       message,
//       data: null,
//     });
//   };
  