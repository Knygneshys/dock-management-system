using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JadeWesserPort.Data.Migrations.SqliteMigrations
{
    /// <inheritdoc />
    public partial class RemoveVesselVisits_Sqlite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VesselVisits");

            migrationBuilder.AddColumn<Guid>(
                name: "DockId",
                table: "VesselVisitNotifications",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VesselVisitNotifications_DockId",
                table: "VesselVisitNotifications",
                column: "DockId");

            migrationBuilder.AddForeignKey(
                name: "FK_VesselVisitNotifications_DockRecords_DockId",
                table: "VesselVisitNotifications",
                column: "DockId",
                principalTable: "DockRecords",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VesselVisitNotifications_DockRecords_DockId",
                table: "VesselVisitNotifications");

            migrationBuilder.DropIndex(
                name: "IX_VesselVisitNotifications_DockId",
                table: "VesselVisitNotifications");

            migrationBuilder.DropColumn(
                name: "DockId",
                table: "VesselVisitNotifications");

            migrationBuilder.CreateTable(
                name: "VesselVisits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DockId = table.Column<Guid>(type: "TEXT", nullable: false),
                    VesselId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Code = table.Column<int>(type: "INTEGER", nullable: false),
                    Eta = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Etd = table.Column<DateTime>(type: "TEXT", nullable: false)
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
    }
}
