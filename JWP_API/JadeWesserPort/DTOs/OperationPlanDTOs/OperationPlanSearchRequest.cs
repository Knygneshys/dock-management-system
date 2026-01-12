namespace JadeWesserPort.DTOs.OperationPlanDTOs;

public class OperationPlanSearchRequest
{
    public string? From {  get; set; }
    public string? To {  get; set; }
    public int? VvnCode {  get; set; }
    public string? SortBy {  get; set; }
    public string? SortDir {  get; set; }
}
