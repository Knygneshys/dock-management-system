using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JadeWesserPort.Data.Migrations.PostgresMigrations
{
    /// <inheritdoc />
    public partial class FixResources_Postgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DockRecordId",
                table: "Resources",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StorageAreaId",
                table: "Resources",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StotageAreaId",
                table: "Resources",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Resources_DockRecordId",
                table: "Resources",
                column: "DockRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_Resources_StorageAreaId",
                table: "Resources",
                column: "StorageAreaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Resources_DockRecords_DockRecordId",
                table: "Resources",
                column: "DockRecordId",
                principalTable: "DockRecords",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Resources_StorageAreas_StorageAreaId",
                table: "Resources",
                column: "StorageAreaId",
                principalTable: "StorageAreas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resources_DockRecords_DockRecordId",
                table: "Resources");

            migrationBuilder.DropForeignKey(
                name: "FK_Resources_StorageAreas_StorageAreaId",
                table: "Resources");

            migrationBuilder.DropIndex(
                name: "IX_Resources_DockRecordId",
                table: "Resources");

            migrationBuilder.DropIndex(
                name: "IX_Resources_StorageAreaId",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "DockRecordId",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "StorageAreaId",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "StotageAreaId",
                table: "Resources");
        }
    }
}
