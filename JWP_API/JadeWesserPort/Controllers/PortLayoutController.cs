using Microsoft.AspNetCore.Mvc;
using JadeWesserPort.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PortLayoutController : ControllerBase
{
    private readonly IPortLayoutService _service;

    public PortLayoutController(IPortLayoutService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetPortLayout()
    {
        var layout = await _service.GetLayoutAsync();
        return Ok(layout);
    }

    [Authorize]
    [HttpGet("material/dock")]
    public IActionResult GetDockMaterial()
    {
        var material = _service.GetDockMaterialProperties();

        return Ok(material);
    }
    
    [Authorize]
    [HttpGet("material/warehouse")]
    public IActionResult GetWarehouseMaterial()
    {
        var material = _service.GetWarehouseMaterialProperties();

        return Ok(material);
    }
    
    [Authorize]
    [HttpGet("material/yard")]
    public IActionResult GetYardMaterial()
    {
        var material = _service.GetYardMaterialProperties();

        return Ok(material);
    }
    
    [Authorize]
    [HttpGet("material/portGround")]
    public IActionResult GetPortGroundMaterial()
    {
        var material = _service.GetPortGroundMaterialProperties();

        return Ok(material);
    }
    
    [Authorize]
    [HttpGet("material/water")]
    public IActionResult GetWaterMaterial()
    {
        var material = _service.GetWaterMaterialProperties();

        return Ok(material);
    }
}
