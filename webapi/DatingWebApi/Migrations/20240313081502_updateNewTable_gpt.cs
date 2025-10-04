using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingWebApi.Migrations
{
    public partial class updateNewTable_gpt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DataCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GptMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Send_TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUser = table.Column<bool>(type: "bit", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GptMessages", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "DataCategories",
                columns: new[] { "Id", "Name" },
                values: new object[] { 1, "Interest" });

            migrationBuilder.InsertData(
                table: "DataCategories",
                columns: new[] { "Id", "Name" },
                values: new object[] { 2, "Personality" });

            migrationBuilder.InsertData(
                table: "DataCategories",
                columns: new[] { "Id", "Name" },
                values: new object[] { 3, "Hate Personality" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DataCategories");

            migrationBuilder.DropTable(
                name: "GptMessages");
        }
    }
}
