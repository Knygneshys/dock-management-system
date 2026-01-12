using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselDTOs;
using JWPTests.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Services;

public class VesselService(IVesselRepository vesselRepository) : IVesselService
{
    public bool CheckIfImoNumberIsValidAsync(string imoNumber)
    {
        const int imoNumberLength = 11;
        if (!imoNumber.Length.Equals(imoNumberLength))
        {
            return false;
        }

        var uniqueIndentifier = imoNumber.Substring(4, 6);
        int sum = 0;
        int index = 0;
        for (int i = 7; i >= 2; i--)
        {
            sum += (int)char.GetNumericValue(uniqueIndentifier[index++]) * i;
        }
        
        return imoNumber.Last().Equals(sum.ToString().Last());
    }

    public async Task<IEnumerable<Vessel>?> GetByFilterAsync(string? imo, string? name, string? operatorName, FilterOperator filterOperator)
    {
        
        var operationIsEquals = filterOperator.Equals(FilterOperator.Equals);
        
        var isNotValidFilterOperator = !operationIsEquals &&
                                       !filterOperator.Equals(FilterOperator.Contains);
        var imoIsEmpty = string.IsNullOrEmpty(imo);
        var nameIsEmpty = string.IsNullOrEmpty(name);
        var operatorNameIsEmpty = string.IsNullOrEmpty(operatorName);
        var allVariablesAreEmpty = imoIsEmpty && operatorNameIsEmpty && nameIsEmpty;
        
        if (isNotValidFilterOperator || allVariablesAreEmpty)
        {
            return null;
        }

        var query = vesselRepository.GetAllQueryable();

        if (!imoIsEmpty)
        {
            imo = imo.ToUpper();
            if (operationIsEquals)
            {
                query = query.Where(vessel => vessel.Imo.ToUpper().Equals(imo));
            }
            else
            {
                query = query.Where(vessel => vessel.Imo.ToUpper().Contains(imo));
            }
        }

        if (!nameIsEmpty)
        {
            name = name.ToLower();
            if (operationIsEquals)
            {
                query = query.Where(vessel => vessel.Name.ToLower().Equals(name));
            }
            else
            {
                query = query.Where(vessel => vessel.Name.ToLower().Contains(name));
            }
        }

        if (!operatorNameIsEmpty)
        {
            operatorName = operatorName.ToLower();
            if (operationIsEquals)
            {
                query = query.Where(vessel => vessel.Operator.Name.ToLower().Equals(operatorName));
            }
            else
            {
                query = query.Where(vessel => vessel.Operator.Name.ToLower().Contains(operatorName));
            }
        }

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<Vessel>> GetBySearchAsync(string? imo, string? name, string? operatorCode, FilterOperator filterOperator)
    {
        var operationIsEquals = filterOperator.Equals(FilterOperator.Equals);
        
        var isNotValidFilterOperator = !operationIsEquals &&
                                         !filterOperator.Equals(FilterOperator.Contains);
        var allThreeVariablesAreEmpty = string.IsNullOrEmpty(name) && string.IsNullOrEmpty(imo) && string.IsNullOrEmpty(operatorCode);
        
        if (isNotValidFilterOperator || allThreeVariablesAreEmpty)
        {
            return [];
        }

        var query = vesselRepository.GetAllQueryable();

        if (!string.IsNullOrEmpty(name))
        {
            name = name.ToLower();
            if (operationIsEquals)
            {
                query = query.Where(vesselType => vesselType.Name.ToLower().Equals(name));
            }
            else
            {
                query = query.Where(vesselType => vesselType.Name.ToLower().Contains(name));
            }
        }

        if (!string.IsNullOrEmpty(imo))
        {
            imo = imo.ToLower();
            if (operationIsEquals)
            {
                query = query.Where(vessel => vessel.Imo.ToLower().Equals(imo));
            }
            else
            {
                query = query.Where(vessel => vessel.Imo.ToLower().Contains(imo));
            }
        }
        
        if (!string.IsNullOrEmpty(operatorCode))
        {
            operatorCode = operatorCode.ToLower();
            if (operationIsEquals)
            {
                query = query.Where(vessel => vessel.Operator.Code.ToLower().Equals(operatorCode));
            }
            else
            {
                query = query.Where(vessel => vessel.Operator.Code.ToLower().Contains(operatorCode));
            }
        }

        return await query.ToListAsync();
    }
}