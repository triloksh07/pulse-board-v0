export function asyncHandler(handler) {
  return (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);
}

// import { Request, Response, NextFunction, RequestHandler } from 'express';

// export const asyncHandler = <
//     TReq extends Request = Request,
//     TRes extends Response = Response
// >(
//     fn: (req: TReq, res: TRes, next: NextFunction) => Promise<void | any>
// ): RequestHandler => {
//     return (req, res, next) => {
//         Promise.resolve(fn(req as TReq, res as TRes, next)).catch(err => next(err));
//     };
// };
