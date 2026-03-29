export function successResponse(data, message = 'Success') {
  return { ok: true, message, data };
}

export function errorResponse(message = 'Error', statusCode = 500) {
  return { ok: false, message, statusCode };
}
