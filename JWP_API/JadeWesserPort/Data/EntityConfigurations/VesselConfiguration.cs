using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JadeWesserPort.Data.EntityConfigurations;


public class VesselConfiguration : IEntityTypeConfiguration<Vessel>
{
    public void Configure(EntityTypeBuilder<Vessel> builder)
    {
        builder
            .HasOne(vessel => vessel.Type)
            .WithMany(vesselType => vesselType.Vessels)
            .HasForeignKey(vessel => vessel.TypeId);
        
        builder
            .HasOne(vessel => vessel.Operator)
            .WithMany(op => op.OperatedVessels)
            .HasForeignKey(vessel => vessel.OperatorId);

        builder
            .HasOne(vessel => vessel.Owner)
            .WithMany(op => op.OwnedVessels)
            .HasForeignKey(vessel => vessel.OwnerId);
    }
}