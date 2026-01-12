using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JadeWesserPort.Data.Migrations.PostgresMigrations
{
    /// <inheritdoc />
    public partial class InitialCreation_Postgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CargoManifests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CargoType = table.Column<int>(type: "integer", nullable: false),
                    Discriminator = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CargoManifests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CrewMember",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CitizenshipId = table.Column<int>(type: "integer", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    Nationality = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewMember", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Feedbacks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OfficerId = table.Column<string>(type: "text", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedbacks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Qualifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Qualifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Resources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AlphanumericCode = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SetupTimeMinutes = table.Column<int>(type: "integer", nullable: false),
                    Discriminator = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resources", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StaffMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MecanographicNumber = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    isActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffMembers", x => x.Id);
                    table.UniqueConstraint("AK_StaffMembers_MecanographicNumber", x => x.MecanographicNumber);
                });

            migrationBuilder.CreateTable(
                name: "StorageAreas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    MaxCapacity = table.Column<int>(type: "integer", nullable: false),
                    CurrentOccupancy = table.Column<int>(type: "integer", nullable: false),
                    Position3D_X = table.Column<float>(type: "real", nullable: false),
                    Position3D_Y = table.Column<float>(type: "real", nullable: false),
                    Position3D_Z = table.Column<float>(type: "real", nullable: false),
                    Size3D_Width = table.Column<float>(type: "real", nullable: false),
                    Size3D_Height = table.Column<float>(type: "real", nullable: false),
                    Size3D_Depth = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorageAreas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Auth0Id = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VesselTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false),
                    MaxRows = table.Column<int>(type: "integer", nullable: false),
                    MaxBays = table.Column<int>(type: "integer", nullable: false),
                    MaxTiers = table.Column<int>(type: "integer", nullable: false),
                    Length = table.Column<float>(type: "real", nullable: false),
                    Draft = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VesselTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CargoItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContainerISO = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    From = table.Column<string>(type: "text", nullable: false),
                    To = table.Column<string>(type: "text", nullable: false),
                    VesselContainerPosition_Bay = table.Column<int>(type: "integer", nullable: false),
                    VesselContainerPosition_Row = table.Column<int>(type: "integer", nullable: false),
                    VesselContainerPosition_Tier = table.Column<int>(type: "integer", nullable: false),
                    CargoManifestId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CargoItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CargoItems_CargoManifests_CargoManifestId",
                        column: x => x.CargoManifestId,
                        principalTable: "CargoManifests",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "QualificationResource",
                columns: table => new
                {
                    QualificationsId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResourcesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QualificationResource", x => new { x.QualificationsId, x.ResourcesId });
                    table.ForeignKey(
                        name: "FK_QualificationResource_Qualifications_QualificationsId",
                        column: x => x.QualificationsId,
                        principalTable: "Qualifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QualificationResource_Resources_ResourcesId",
                        column: x => x.ResourcesId,
                        principalTable: "Resources",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OperationalWindows",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    StaffMemberId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperationalWindows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OperationalWindows_StaffMembers_StaffMemberId",
                        column: x => x.StaffMemberId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QualificationStaffMember",
                columns: table => new
                {
                    QualificationsId = table.Column<Guid>(type: "uuid", nullable: false),
                    StaffMembersId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QualificationStaffMember", x => new { x.QualificationsId, x.StaffMembersId });
                    table.ForeignKey(
                        name: "FK_QualificationStaffMember_Qualifications_QualificationsId",
                        column: x => x.QualificationsId,
                        principalTable: "Qualifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QualificationStaffMember_StaffMembers_StaffMembersId",
                        column: x => x.StaffMembersId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Shifts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    From = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    To = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StaffMemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResourceId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shifts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shifts_Resources_ResourceId",
                        column: x => x.ResourceId,
                        principalTable: "Resources",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Shifts_StaffMembers_StaffMemberId",
                        column: x => x.StaffMemberId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DockRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Length = table.Column<float>(type: "real", nullable: false),
                    Depth = table.Column<float>(type: "real", nullable: false),
                    MaxDraft = table.Column<float>(type: "real", nullable: false),
                    Position3D_X = table.Column<float>(type: "real", nullable: false),
                    Position3D_Y = table.Column<float>(type: "real", nullable: false),
                    Position3D_Z = table.Column<float>(type: "real", nullable: false),
                    Size3D_Width = table.Column<float>(type: "real", nullable: false),
                    Size3D_Height = table.Column<float>(type: "real", nullable: false),
                    Size3D_Depth = table.Column<float>(type: "real", nullable: false),
                    StorageAreaId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DockRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DockRecords_StorageAreas_StorageAreaId",
                        column: x => x.StorageAreaId,
                        principalTable: "StorageAreas",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "StockItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContainerISO = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    From = table.Column<string>(type: "text", nullable: false),
                    To = table.Column<string>(type: "text", nullable: false),
                    AvailableSince = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AvailableUntil = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StorageAreaId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockItems_StorageAreas_StorageAreaId",
                        column: x => x.StorageAreaId,
                        principalTable: "StorageAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShippingAgentRepresentatives",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingAgentRepresentatives", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShippingAgentRepresentatives_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShippingAgentRepresentatives_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vessels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Imo = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    TypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    OperatorId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vessels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vessels_Companies_OperatorId",
                        column: x => x.OperatorId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vessels_Companies_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vessels_VesselTypes_TypeId",
                        column: x => x.TypeId,
                        principalTable: "VesselTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DockRecordVesselType",
                columns: table => new
                {
                    AllowedVesselTypesId = table.Column<Guid>(type: "uuid", nullable: false),
                    DocksId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DockRecordVesselType", x => new { x.AllowedVesselTypesId, x.DocksId });
                    table.ForeignKey(
                        name: "FK_DockRecordVesselType_DockRecords_DocksId",
                        column: x => x.DocksId,
                        principalTable: "DockRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DockRecordVesselType_VesselTypes_AllowedVesselTypesId",
                        column: x => x.AllowedVesselTypesId,
                        principalTable: "VesselTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DockStorageDistances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    DockRecordId = table.Column<Guid>(type: "uuid", nullable: false),
                    StorageAreaId = table.Column<Guid>(type: "uuid", nullable: false),
                    DistanceMeters = table.Column<double>(type: "double precision", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DockStorageDistances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DockStorageDistances_DockRecords_DockRecordId",
                        column: x => x.DockRecordId,
                        principalTable: "DockRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DockStorageDistances_StorageAreas_StorageAreaId",
                        column: x => x.StorageAreaId,
                        principalTable: "StorageAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VesselVisitNotifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<int>(type: "integer", nullable: false),
                    Eta = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Etd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    VesselId = table.Column<Guid>(type: "uuid", nullable: false),
                    ShippingAgentRepresentativeId = table.Column<Guid>(type: "uuid", nullable: false),
                    FeedBackId = table.Column<Guid>(type: "uuid", nullable: true),
                    CargoLoadManifestId = table.Column<Guid>(type: "uuid", nullable: true),
                    CargoUnloadManifestId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VesselVisitNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VesselVisitNotifications_CargoManifests_CargoLoadManifestId",
                        column: x => x.CargoLoadManifestId,
                        principalTable: "CargoManifests",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_VesselVisitNotifications_CargoManifests_CargoUnloadManifest~",
                        column: x => x.CargoUnloadManifestId,
                        principalTable: "CargoManifests",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_VesselVisitNotifications_Feedbacks_FeedBackId",
                        column: x => x.FeedBackId,
                        principalTable: "Feedbacks",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_VesselVisitNotifications_ShippingAgentRepresentatives_Shipp~",
                        column: x => x.ShippingAgentRepresentativeId,
                        principalTable: "ShippingAgentRepresentatives",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VesselVisitNotifications_Vessels_VesselId",
                        column: x => x.VesselId,
                        principalTable: "Vessels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VesselVisits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<int>(type: "integer", nullable: false),
                    Eta = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Etd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DockId = table.Column<Guid>(type: "uuid", nullable: false),
                    VesselId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VesselVisits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VesselVisits_DockRecords_DockId",
                        column: x => x.DockId,
                        principalTable: "DockRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VesselVisits_Vessels_VesselId",
                        column: x => x.VesselId,
                        principalTable: "Vessels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CrewMemberVesselVisitNotification",
                columns: table => new
                {
                    CrewManifestId = table.Column<Guid>(type: "uuid", nullable: false),
                    inVesselVisitsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewMemberVesselVisitNotification", x => new { x.CrewManifestId, x.inVesselVisitsId });
                    table.ForeignKey(
                        name: "FK_CrewMemberVesselVisitNotification_CrewMember_CrewManifestId",
                        column: x => x.CrewManifestId,
                        principalTable: "CrewMember",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CrewMemberVesselVisitNotification_VesselVisitNotifications_~",
                        column: x => x.inVesselVisitsId,
                        principalTable: "VesselVisitNotifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CargoItems_CargoManifestId",
                table: "CargoItems",
                column: "CargoManifestId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_Code",
                table: "Companies",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CrewMemberVesselVisitNotification_inVesselVisitsId",
                table: "CrewMemberVesselVisitNotification",
                column: "inVesselVisitsId");

            migrationBuilder.CreateIndex(
                name: "IX_DockRecords_Code",
                table: "DockRecords",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DockRecords_StorageAreaId",
                table: "DockRecords",
                column: "StorageAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_DockRecordVesselType_DocksId",
                table: "DockRecordVesselType",
                column: "DocksId");

            migrationBuilder.CreateIndex(
                name: "IX_DockStorageDistances_DockRecordId",
                table: "DockStorageDistances",
                column: "DockRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_DockStorageDistances_StorageAreaId",
                table: "DockStorageDistances",
                column: "StorageAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationalWindows_StaffMemberId",
                table: "OperationalWindows",
                column: "StaffMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_QualificationResource_ResourcesId",
                table: "QualificationResource",
                column: "ResourcesId");

            migrationBuilder.CreateIndex(
                name: "IX_Qualifications_Code",
                table: "Qualifications",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QualificationStaffMember_StaffMembersId",
                table: "QualificationStaffMember",
                column: "StaffMembersId");

            migrationBuilder.CreateIndex(
                name: "IX_Resources_AlphanumericCode",
                table: "Resources",
                column: "AlphanumericCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_ResourceId",
                table: "Shifts",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_StaffMemberId",
                table: "Shifts",
                column: "StaffMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingAgentRepresentatives_CompanyId",
                table: "ShippingAgentRepresentatives",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingAgentRepresentatives_UserId",
                table: "ShippingAgentRepresentatives",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffMembers_MecanographicNumber",
                table: "StaffMembers",
                column: "MecanographicNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StockItems_ContainerISO",
                table: "StockItems",
                column: "ContainerISO",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StockItems_StorageAreaId",
                table: "StockItems",
                column: "StorageAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Auth0Id",
                table: "Users",
                column: "Auth0Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_Imo",
                table: "Vessels",
                column: "Imo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_OperatorId",
                table: "Vessels",
                column: "OperatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_OwnerId",
                table: "Vessels",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Vessels_TypeId",
                table: "Vessels",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_VesselTypes_Code",
                table: "VesselTypes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_CargoLoadManifestId",
                table: "VesselVisitNotifications",
                column: "CargoLoadManifestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_CargoUnloadManifestId",
                table: "VesselVisitNotifications",
                column: "CargoUnloadManifestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_Code",
                table: "VesselVisitNotifications",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_FeedBackId",
                table: "VesselVisitNotifications",
                column: "FeedBackId");

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_ShippingAgentRepresentativeId",
                table: "VesselVisitNotifications",
                column: "ShippingAgentRepresentativeId");

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_VesselId",
                table: "VesselVisitNotifications",
                column: "VesselId");

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisits_Code",
                table: "VesselVisits",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisits_DockId",
                table: "VesselVisits",
                column: "DockId");

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisits_VesselId",
                table: "VesselVisits",
                column: "VesselId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CargoItems");

            migrationBuilder.DropTable(
                name: "CrewMemberVesselVisitNotification");

            migrationBuilder.DropTable(
                name: "DockRecordVesselType");

            migrationBuilder.DropTable(
                name: "DockStorageDistances");

            migrationBuilder.DropTable(
                name: "OperationalWindows");

            migrationBuilder.DropTable(
                name: "QualificationResource");

            migrationBuilder.DropTable(
                name: "QualificationStaffMember");

            migrationBuilder.DropTable(
                name: "Shifts");

            migrationBuilder.DropTable(
                name: "StockItems");

            migrationBuilder.DropTable(
                name: "VesselVisits");

            migrationBuilder.DropTable(
                name: "CrewMember");

            migrationBuilder.DropTable(
                name: "VesselVisitNotifications");

            migrationBuilder.DropTable(
                name: "Qualifications");

            migrationBuilder.DropTable(
                name: "Resources");

            migrationBuilder.DropTable(
                name: "StaffMembers");

            migrationBuilder.DropTable(
                name: "DockRecords");

            migrationBuilder.DropTable(
                name: "CargoManifests");

            migrationBuilder.DropTable(
                name: "Feedbacks");

            migrationBuilder.DropTable(
                name: "ShippingAgentRepresentatives");

            migrationBuilder.DropTable(
                name: "Vessels");

            migrationBuilder.DropTable(
                name: "StorageAreas");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "VesselTypes");
        }
    }
}
