using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingWebApi.Migrations
{
    public partial class updateNewTable_gpt2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsUser",
                table: "GptMessages");

            migrationBuilder.AddColumn<int>(
                name: "GptRoleId",
                table: "GptMessages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "GptRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GptRoles", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "GptRoles",
                columns: new[] { "Id", "Name" },
                values: new object[] { 1, "System" });

            migrationBuilder.InsertData(
                table: "GptRoles",
                columns: new[] { "Id", "Name" },
                values: new object[] { 2, "Asistant" });

            migrationBuilder.InsertData(
                table: "GptRoles",
                columns: new[] { "Id", "Name" },
                values: new object[] { 3, "User" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GptRoles");

            migrationBuilder.DropColumn(
                name: "GptRoleId",
                table: "GptMessages");

            migrationBuilder.AddColumn<bool>(
                name: "IsUser",
                table: "GptMessages",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
