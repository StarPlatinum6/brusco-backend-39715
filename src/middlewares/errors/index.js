import ErrorCodes from "../../services/errors/enums.js";

export default (error, req, res, next) => {
  if (Object.values(ErrorCodes).includes(error.code)) {
    res.status(error.status).send({
      status: "error",
      error: error.name,
      message: error.message,
      cause: error.cause,
    });
    console.log(
      "Error code",
      error.code,
      Object.keys(ErrorCodes)[error.code - 1],
      error.message,
      ":",
      error.cause
    );
  } else {
    console.log("Error code UNHANDLED_ERROR");
    res.status(500).send({ status: "error", error: "Unhandled error" });
  }
};
