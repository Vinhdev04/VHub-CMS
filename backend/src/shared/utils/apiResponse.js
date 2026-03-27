export function successResponse(data, message = "OK") {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message = "Unexpected error") {
  return {
    success: false,
    message,
  };
}
