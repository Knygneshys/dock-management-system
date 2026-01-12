using System.Text;
using System.Text.Json;
using JadeWesserPort.DTOs.CompTaskCategoryDTOs;
using JadeWesserPort.DTOs.DockStorageDistanceDTOs.CompTasksDTOs; 
using JadeWesserPort.DTOs.IncidentTypeDTOs;
using JadeWesserPort.DTOs.IncidentTypeDTOs.Commands;
using JadeWesserPort.DTOs.OperationPlanDTOs;
using System.Text.Json.Serialization;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.IncidentDTOs;
using JadeWesserPort.DTOs.VVEDTOs;
using JadeWesserPort.DTOs.ExecutedOperationDTOs;

namespace JadeWesserPort.Intermediators;

public class OemIntermediator(HttpClient httpClient)
{
    private readonly JsonSerializerOptions _jsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public async Task<string> CreateOperationPlanAsync(CreateOperationPlanCommand command)
    {
        var serializedRequest = JsonSerializer.Serialize(command, _jsonSerializerOptions);
        var stringContent = new StringContent(serializedRequest, Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync("api/operation-plan", stringContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            
            throw new Exception(errorContent);
        }

        var result = await response.Content.ReadFromJsonAsync<string>();

        return result!;
    }

    public async Task<OperationPlanResponseDto> UpdateOperationPlanAsync(int vvnCode,
        UpdateOperationPlanCommand command)
    {
        var serializedRequest = JsonSerializer.Serialize(command, _jsonSerializerOptions);
        var stringContent = new StringContent(serializedRequest, Encoding.UTF8, "application/json");

        var response = await httpClient.PutAsync($"api/operation-plan/{vvnCode}", stringContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            
            throw new Exception(errorContent);
        }

        var result = await response.Content.ReadFromJsonAsync<OperationPlanResponseDto>();

        return result!;
    }

    public async Task<OperationPlanResponseDto> GetOperationPlanByCode(int vvnCode)
    {
        var response = await httpClient.GetAsync($"api/operation-plan/{vvnCode}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            
            throw new Exception(errorContent);
        }

        var result = await response.Content.ReadFromJsonAsync<OperationPlanResponseDto>();

        return result!;
    }
    
    public async Task<HttpResponseMessage> SearchOperationPlansAsync(OperationPlanSearchRequest request)
    {
        var queryParams = new Dictionary<string, string?>();

        if (!string.IsNullOrWhiteSpace(request.From))
        {
            queryParams["from"] = request.From;
        }
        if (!string.IsNullOrWhiteSpace(request.To))
        {
            queryParams["to"] = request.To;
        }
        if (!string.IsNullOrWhiteSpace(request.VvnCode.ToString()))
        {
            queryParams["vvnCode"] = request.VvnCode.ToString();
        }
        if (!string.IsNullOrWhiteSpace(request.SortBy))
        {
            queryParams["sortBy"] = request.SortBy;
        }
        if (!string.IsNullOrWhiteSpace(request.SortDir))
        {
            queryParams["sortDir"] = request.SortDir;
        }

        var query = QueryString.Create(queryParams);

        var response = await httpClient.GetAsync($"api/operation-plan/{query}");

        return response;
    }

    public async Task<ComplementaryTaskDto> CreateComplementaryTaskAsync(CreateComplementaryTaskDto dto)
    {
        var serializedRequest = JsonSerializer.Serialize(dto, _jsonSerializerOptions);
        Console.WriteLine($"[OemIntermediator] Serialized JSON: {serializedRequest}");
        var stringContent = new StringContent(serializedRequest, Encoding.UTF8, "application/json");
        
        var response = await httpClient.PostAsync("api/complementary-tasks", stringContent);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
        
            throw new Exception("An unexpected error occurred!");
        }

        var result = await response.Content.ReadFromJsonAsync<ComplementaryTaskDto>(_jsonSerializerOptions);

        return result!;
    }
    public async Task<List<ComplementaryTaskDto>> GetAllComplementaryTasksAsync()
    {
        var response = await httpClient.GetAsync("api/complementary-tasks");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
            
            throw new Exception("An unexpected error occurred!");
        }

        var result = await response.Content.ReadFromJsonAsync<List<ComplementaryTaskDto>>(_jsonSerializerOptions);

        return result ?? [];
    }

    public async Task<List<ComplementaryTaskDto>> GetComplementaryTasksByVveAsync(int vveCode)
    {
        var response = await httpClient.GetAsync($"api/complementary-tasks/vve/{vveCode}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
            
            throw new Exception("An unexpected error occurred!");
        }

        var result = await response.Content.ReadFromJsonAsync<List<ComplementaryTaskDto>>(_jsonSerializerOptions);

        return result ?? new List<ComplementaryTaskDto>();
    }

    public async Task<List<ComplementaryTaskDto>> SearchComplementaryTasksAsync(DateTime? start = null, DateTime? end = null, string? status = null)
    {
        var queryParams = new List<string>();
        
        if (start.HasValue)
            queryParams.Add($"start={start.Value:yyyy-MM-dd}");
        
        if (end.HasValue)
            queryParams.Add($"end={end.Value:yyyy-MM-dd}");
        
        if (!string.IsNullOrEmpty(status))
            queryParams.Add($"status={status}");

        var queryString = queryParams.Count > 0 ? "?" + string.Join("&", queryParams) : "";
        
        var response = await httpClient.GetAsync($"api/complementary-tasks{queryString}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
            
            throw new Exception("An unexpected error occurred!");
        }

        var result = await response.Content.ReadFromJsonAsync<List<ComplementaryTaskDto>>(_jsonSerializerOptions);

        return result ?? new List<ComplementaryTaskDto>();
    }

    public async Task UpdateComplementaryTaskAsync(string code, UpdateComplementaryTaskDto dto)
    {
        var serializedRequest = JsonSerializer.Serialize(dto, _jsonSerializerOptions);
        var stringContent = new StringContent(serializedRequest, Encoding.UTF8, "application/json");

        var response = await httpClient.PutAsync($"api/complementary-tasks/{code}", stringContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
        
            throw new Exception("An unexpected error occurred!");
        }
    }
    
    public async Task<HttpResponseMessage> SearchComplementaryTaskCategoriesAsync(CompTaskCategorySearchRequest request)
    {
        var queryParams = new Dictionary<string, string?>();

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            queryParams["name"] = request.Name;
        }

        var query = QueryString.Create(queryParams);

        var response = await httpClient.GetAsync($"api/complementary-task-categories/{query}");

        return response;
    }

    public async Task<HttpResponseMessage> CreateComplementaryTaskCategoryAsync(CompTaskCategoryDto dto)
    {
        return await httpClient.PostAsJsonAsync("api/complementary-task-categories", dto, _jsonSerializerOptions);
    }

    public async Task<HttpResponseMessage> SearchIncidentsAsync(IncidentSearchRequest request)
    {
        var queryParams = new Dictionary<string, string?>();
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            queryParams["status"] = request.Status;
        }
        if (!string.IsNullOrWhiteSpace(request.Severity))
        {
            queryParams["severity"] = request.Severity;
        }
        if (request.StartDate.HasValue)
        {
            queryParams["startDate"] = request.StartDate.ToString();
        }
        if (request.EndDate.HasValue)
        {
            queryParams["endDate"] = request.EndDate.ToString();
        }
        if (request.VveCode.HasValue)
        {
            queryParams["vveCode"] = request.VveCode.ToString();
        }
        var query = QueryString.Create(queryParams);

        var response = await httpClient.GetAsync($"api/incidents/{query}");

        return response;
    }

    public async Task<HttpResponseMessage> CreateIncidentAsync(CreateIncidentCommand dto)
    {
        return await httpClient.PostAsJsonAsync("api/incidents", dto, _jsonSerializerOptions);
    }

    public async Task<HttpResponseMessage> AssociateVVEtoIncidentAsync(VVEtoIncidentCommand command)
    {
        return await httpClient.PostAsJsonAsync("api/incidents/associate-vve", command, _jsonSerializerOptions);
    }

    public async Task<HttpResponseMessage> DetachVVEfromIncidentAsync(VVEtoIncidentCommand command)
    {
        var request = new HttpRequestMessage( HttpMethod.Delete,"api/incidents/detach-vve")
        {
            Content = JsonContent.Create(command, options: _jsonSerializerOptions)
        };

        return await httpClient.SendAsync(request);
    }

    public async Task<HttpResponseMessage> ResolveIncidentAsync(string code)
    {
        return await httpClient.PatchAsync($"api/incidents/{code}/resolve", null);
    }

    public async Task<List<VVEDto>> GetAllVVEsAsync()
    {
        var response = await httpClient.GetAsync("api/vves");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
        
            throw new Exception("An unexpected error occurred!");
        }

        var result = await response.Content.ReadFromJsonAsync<List<VVEDto>>(_jsonSerializerOptions);

        return result ?? new List<VVEDto>();
    }

    public async Task<List<ExecutedOperationResponseDto>> GetExecutedOperationsByVveCode(int code)
    {
        var response = await httpClient.GetAsync($"api/vves/get-executed-operations/{code}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            throw new Exception(errorContent);
        }

        var result = await response.Content.ReadFromJsonAsync<List<ExecutedOperationResponseDto>>(_jsonSerializerOptions);

        return result!;
    }

    public async Task<VVEDto> AddExecutedOperationToVve(int code, CreateExecutedOperationCommand command)
    {
        var serializedRequest = JsonSerializer.Serialize(command, _jsonSerializerOptions);
        var stringContent = new StringContent(serializedRequest, Encoding.UTF8, "application/json");

        var response = await httpClient.PutAsync($"api/vves/add-executed-operation/{code}", stringContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            
            throw new Exception(errorContent);
        }

        var result = await response.Content.ReadFromJsonAsync<VVEDto>();

        return result!;
    }
    
    public async Task<ComplementaryTaskDto> GetComplementaryTaskByCodeAsync(string code)
    {
        var response = await httpClient.GetAsync($"api/complementary-tasks/{code}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
        
            throw new Exception("An unexpected error occurred!");
        }

        var result = await response.Content.ReadFromJsonAsync<ComplementaryTaskDto>(_jsonSerializerOptions);

        return result!;
    }
    
    public async Task<List<VVEDto>> SearchVVEsAsync(DateTime? start = null, string? vesselImo = null, string? status = null)
    {
        var queryParams = new List<string>();
    
        if (start.HasValue)
            queryParams.Add($"start={start.Value:yyyy-MM-ddTHH:mm:ss}");
    
        if (!string.IsNullOrEmpty(vesselImo))
            queryParams.Add($"vesselImo={vesselImo}");
    
        if (!string.IsNullOrEmpty(status))
            queryParams.Add($"status={status}");

        var queryString = queryParams.Count > 0 ? "?" + string.Join("&", queryParams) : "";
    
        var response = await httpClient.GetAsync($"api/vves/search{queryString}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
        
            throw new Exception("An unexpected error occurred!");
        }

        var result = await response.Content.ReadFromJsonAsync<List<VVEDto>>(_jsonSerializerOptions);

        return result ?? new List<VVEDto>();
    }
    
    public async Task DeleteOperationPlansByDateAsync(string date)
    {
        var response = await httpClient.DeleteAsync($"api/operation-plan/by-date/{date}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
        
            throw new Exception("An unexpected error occurred!");
        }
    }

    public async Task<string> CreateIncidentTypeAsync(CreateIncidentTypeCommand command)
    {
        var serializedRequest = JsonSerializer.Serialize(command, _jsonSerializerOptions);
        var stringContent = new StringContent(serializedRequest, Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync("api/incident-type", stringContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            
            throw new Exception(errorContent);
        }

        var result = await response.Content.ReadFromJsonAsync<string>();

        return result!;
    }

    public async Task<IncidentTypeResponseDto> UpdateIncidentTypeAsync(string code, UpdateIncidentTypeCommand command)
    {
        var serializedRequest = JsonSerializer.Serialize(command, _jsonSerializerOptions);
        var stringContent = new StringContent(serializedRequest, Encoding.UTF8, "application/json");

        var response = await httpClient.PutAsync($"api/incident-type/{code}", stringContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            throw new Exception(errorContent);
        }
        
        var result = await response.Content.ReadFromJsonAsync<IncidentTypeResponseDto>();

        return result!;
    }

    public async Task<List<IncidentTypeResponseDto>> SearchIncidentTypesAsync(string? code, string? parentIncidentTypeCode,
        string? description, SeverityClassification? severity)
    {
        var queryParams = new List<string>();
    
        if (code is not null)
            queryParams.Add($"code={code}");
    
        if (parentIncidentTypeCode is not null)
            queryParams.Add($"parentIncidentTypeCode={parentIncidentTypeCode}");
    
        if (description is not null)
            queryParams.Add($"description={description}");
    
        if (severity is not null)
            queryParams.Add($"severity={severity.Value.ToString()}");

        var queryString = queryParams.Count > 0 ? "?" + string.Join("&", queryParams) : "";

        var uri = $"api/incident-type{queryString}";
    
        var response = await httpClient.GetAsync(uri);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            throw new Exception(errorContent);
        }

        var result = await response.Content.ReadFromJsonAsync<List<IncidentTypeResponseDto>>(_jsonSerializerOptions);

        return result!;
    }

    public async Task<IncidentTypeResponseDto> FindIncidentTypeByCode(string code)
    {
        var response = await httpClient.GetAsync($"api/incident-type/{code}");

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
        
            using var doc = JsonDocument.Parse(errorContent);
            if (doc.RootElement.TryGetProperty("error", out var errorElement))
            {
                throw new Exception(errorElement.GetString());
            }
        
            throw new Exception("An unexpected error occurred!");
        }

        var result = await response.Content.ReadFromJsonAsync<IncidentTypeResponseDto>(_jsonSerializerOptions);

        return result!;
    }
}