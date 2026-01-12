using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.DTOs.StockItemDTOs;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StockItemsController(
    IStockItemsRepository stockItemsRepository,
    IMapper mapper) : ControllerBase
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<StockItemDTO>>> GetAllAsync()
    {
        var items = await stockItemsRepository.GetAllQueryable().ToListAsync();
        var itemDtos = mapper.Map<List<StockItemDTO>>(items);
        return Ok(itemDtos);
    }
}
