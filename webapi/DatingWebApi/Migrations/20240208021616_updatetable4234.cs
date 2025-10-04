using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingWebApi.Migrations
{
    public partial class updatetable4234 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Profile_Users",
                table: "Profile_Users");

            migrationBuilder.AlterColumn<string>(
                name: "ProfileUrl",
                table: "Profile_Users",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Profile_Users",
                table: "Profile_Users",
                columns: new[] { "UserId", "ProfileUrl" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Profile_Users",
                table: "Profile_Users");

            migrationBuilder.AlterColumn<string>(
                name: "ProfileUrl",
                table: "Profile_Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Profile_Users",
                table: "Profile_Users",
                column: "UserId");
        }
    }
}
