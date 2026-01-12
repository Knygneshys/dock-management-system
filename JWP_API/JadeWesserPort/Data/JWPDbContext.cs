using JadeWesserPort.Data.EntityConfigurations;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.Resources;
using JadeWesserPort.Domain.System;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data;

public class JWPDbContext(
    DbContextOptions options) : DbContext(options)
{
    public DbSet<Qualification> Qualifications { get; set; }
    public DbSet<VesselType> VesselTypes { get; set; } = null!;
    public DbSet<DockRecord> DockRecords { get; set; } = null!;
    public DbSet<Resource> Resources { get; set; }
    public DbSet<StaffMember> StaffMembers { get; set; }
    public DbSet<VesselVisitNotification> VesselVisitNotifications { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<Vessel> Vessels { get; set; } = null!;
    public DbSet<ShippingAgentRepresentative> ShippingAgentRepresentatives { get; set; } = null!;
    public DbSet<VVNFeedback> Feedbacks { get; set; } = null!;
    public DbSet<StorageArea> StorageAreas { get; set; } = null!;
    public DbSet<CargoItem> CargoItems { get; set; } = null!;
    public DbSet<CargoManifest> CargoManifests { get; set; } = null!;
    public DbSet<OperationalWindow> OperationalWindows { get; set; } = null!;
    public DbSet<DockStorageDistance> DockStorageDistances { get; set; } = null!;
    public DbSet<Shift> Shifts { get; set; } = null!;
    public DbSet<StockItem> StockItems { get; set; } = null!;
    public DbSet<PrivacyPolicy> PrivacyPolicies { get; set; }
    public DbSet<DataRectificationRequest> DataRectificationRequests { get; set; } = null!;


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        new VesselConfiguration().Configure(modelBuilder.Entity<Vessel>());
        
        modelBuilder.Entity<StaffMember>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasAlternateKey(a => a.MecanographicNumber);
            entity.Property(e => e.MecanographicNumber).IsRequired();
        });

       
        modelBuilder.Entity<DockRecord>()
            .Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);


        modelBuilder.Entity<DockRecord>()
            .HasMany(d => d.AllowedVesselTypes)
            .WithMany(v => v.Docks);

        modelBuilder.Entity<OperationalWindow>(entity =>
        {
            entity.HasKey(e => e.Id);
        
            entity.Property(e => e.StaffMemberId).IsRequired();
            entity.Property(e => e.DayOfWeek).IsRequired();
            entity.Property(e => e.StartTime).IsRequired();
            entity.Property(e => e.EndTime).IsRequired();
             
            entity.HasOne(s => s.StaffMember)
                .WithMany(s => s.OperationalWindows)
                .HasForeignKey(e => e.StaffMemberId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<STSCrane>();
        modelBuilder.Entity<TerminalTruck>();
        modelBuilder.Entity<YardCrane>();
    }
}