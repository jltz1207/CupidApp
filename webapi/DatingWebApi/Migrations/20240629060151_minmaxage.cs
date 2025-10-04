using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingWebApi.Migrations
{
    public partial class minmaxage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AgeShowMe",
                table: "AspNetUsers",
                newName: "ShowMeMinAge");

            migrationBuilder.AddColumn<int>(
                name: "ShowMeMaxAge",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowMeMaxAge",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "ShowMeMinAge",
                table: "AspNetUsers",
                newName: "AgeShowMe");
        }
    }
}
