namespace JadeWesserPort.Domain.Entities.ValueObjects;

public class MaterialProperties
{
    public string ColorMap { get; set; }
    public string? RoughnessMap { get; set; }
    public string? NormalMap { get; set; }
    public float Roughness { get; set; }
    public float Metalness { get; set; }
    public string BaseColor { get; set; }
}