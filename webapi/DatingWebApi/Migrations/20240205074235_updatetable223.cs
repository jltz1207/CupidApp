using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingWebApi.Migrations
{
    public partial class updatetable223 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Values",
                table: "User_Values");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Interests",
                table: "User_Interests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_AboutMes",
                table: "User_AboutMes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Values",
                table: "User_Values",
                columns: new[] { "UserId", "ValueId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Interests",
                table: "User_Interests",
                columns: new[] { "UserId", "InterestId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_AboutMes",
                table: "User_AboutMes",
                columns: new[] { "UserId", "AboutMeId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Values",
                table: "User_Values");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Interests",
                table: "User_Interests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_AboutMes",
                table: "User_AboutMes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Values",
                table: "User_Values",
                column: "UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Interests",
                table: "User_Interests",
                column: "UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_AboutMes",
                table: "User_AboutMes",
                column: "UserId");
        }
    }
}
