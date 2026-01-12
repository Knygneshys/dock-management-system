using JadeWesserPort.Domain;

namespace JadeWesserPort.Validations;

public static class VVNValidations
{
    public static VVNStatus ValidateStatusTransition(VVNStatus current, VVNStatus desired)
    {
        if (current == VVNStatus.Approved || current == VVNStatus.Rejected || current == VVNStatus.Withdrawn)
            throw new InvalidOperationException("Cannot modify an approved, rejected, or withdrawn notification.");

        if (current == VVNStatus.InProgress)
        {
            if (desired == VVNStatus.InProgress || desired == VVNStatus.Submitted || desired == VVNStatus.Withdrawn)
                return desired;

            throw new InvalidOperationException("Status can only remain 'InProgress', be changed to 'Submitted' or 'Withdrawn'.");
        }

        throw new InvalidOperationException("Invalid status transition.");
    }
}
