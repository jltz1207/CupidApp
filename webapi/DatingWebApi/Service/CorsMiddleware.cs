namespace DatingWebApi.Service
{
    public class CorsMiddleware
    {
        private readonly RequestDelegate _next;

        public CorsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            httpContext.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
            httpContext.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpContext.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            httpContext.Response.Headers.Add("Access-Control-Allow-Credentials", "true");

            if (httpContext.Request.Method == "OPTIONS")
            {
                httpContext.Response.StatusCode = 200;
                await httpContext.Response.WriteAsync("OK");
                return;
            }

            await _next(httpContext);
        }
    }
}
