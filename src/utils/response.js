const createErrorResponse = (error, status) => new Response(error, { status });

const createJsonResponse = data =>
  new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' }
  });

module.exports = {
  createErrorResponse,
  createJsonResponse
};
