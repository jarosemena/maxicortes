using MaxiCortes.Application.DTOs.Optimization;
using MaxiCortes.Application.DTOs.Orders;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Application.Interfaces.Services;
using System.Text.Json;

namespace MaxiCortes.Infrastructure.ExternalServices.OptimizationEngine;

public class OptimizationService : IOptimizationService
{
    private readonly IOrderRepository _orderRepository;
    private readonly HttpClient _httpClient;
    private readonly OptimizationServiceOptions _options;

    public OptimizationService(
        IOrderRepository orderRepository,
        HttpClient httpClient,
        OptimizationServiceOptions options)
    {
        _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _options = options ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task<OptimizationResultResponse> OptimizeOrderAsync(
        Guid orderId,
        OptimizationParametersDto parameters,
        CancellationToken cancellationToken = default)
    {
        // Get order details
        var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);
        if (order == null)
            throw new InvalidOperationException($"Order {orderId} not found");

        // Prepare request for Python optimization service
        var optimizationRequest = new
        {
            OrderId = orderId,
            Items = order.Items.Select(item => new
            {
                ItemId = item.Id,
                MaterialId = item.MaterialId,
                Geometry = item.Geometry.ToJson(),
                Quantity = item.Quantity,
                Priority = item.Priority.ToString(),
                MaterialDimensions = new
                {
                    Width = item.Material.Dimensions.Width,
                    Height = item.Material.Dimensions.Height,
                    Thickness = item.Material.Dimensions.Thickness
                }
            }),
            Parameters = parameters
        };

        try
        {
            // Set timeout
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(parameters.MaxOptimizationTimeSeconds));

            // Call Python optimization service
            var jsonContent = JsonSerializer.Serialize(optimizationRequest);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_options.OptimizationEndpoint, content, cts.Token);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync(cts.Token);
            var result = JsonSerializer.Deserialize<OptimizationResultResponse>(responseJson, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return result ?? throw new InvalidOperationException("Invalid response from optimization service");
        }
        catch (TaskCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw new OperationCanceledException("Optimization was cancelled", cancellationToken);
        }
        catch (TaskCanceledException)
        {
            throw new TimeoutException($"Optimization timed out after {parameters.MaxOptimizationTimeSeconds} seconds");
        }
        catch (HttpRequestException ex)
        {
            throw new InvalidOperationException($"Failed to communicate with optimization service: {ex.Message}", ex);
        }
    }

    public async Task<OptimizationResultResponse?> GetOptimizationResultAsync(
        Guid orderId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_options.ResultsEndpoint}/{orderId}", cancellationToken);
            
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return null;

            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);
            var result = JsonSerializer.Deserialize<OptimizationResultResponse>(responseJson, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return result;
        }
        catch (HttpRequestException ex)
        {
            throw new InvalidOperationException($"Failed to retrieve optimization results: {ex.Message}", ex);
        }
    }
}

public class OptimizationServiceOptions
{
    public string BaseUrl { get; set; } = "http://localhost:8000";
    public string OptimizationEndpoint => $"{BaseUrl}/api/optimize";
    public string ResultsEndpoint => $"{BaseUrl}/api/results";
    public int TimeoutSeconds { get; set; } = 300;
}