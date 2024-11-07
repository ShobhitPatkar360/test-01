import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
const plogger = logger.child({ label: "auth header...." });

export default async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(404).send({
      message: "Unauthorized access, please provide an access token",
      status: false,
      data: [],
    });
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ");
  req.auth_token = token[1];

  try {
    const isUser = jwt.verify(req.auth_token, config['SECRET_KEY']);
    if (!isUser || !isUser.token_payload?._id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: "Invalid token ",
      });
    }
    req.user = isUser.token_payload;
    
    next();
  } catch (error) {
    console.log(error);

    return res.status(401).send({
      message: "Token validation failed",
      status: false,
      data: [],
    });
  }
};
