using System.Net;
using System.Text.Json;

namespace MaxiCortes.WebAPI.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new ErrorResponse();

        switch (exception)
        {
            case ArgumentNullException:
                response.Message = exception.Message;
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case ArgumentException:
                response.Message = exception.Message;
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case InvalidOperationException:
                response.Message = exception.Message;
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case TimeoutException:
                response.Message = "The request timed out";
                response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                break;

            case OperationCanceledException:
                response.Message = "The operation was cancelled";
                response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                break;

            default:
                response.Message = "An internal server error occurred";
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}