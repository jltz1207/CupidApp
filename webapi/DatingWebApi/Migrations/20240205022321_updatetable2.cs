using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingWebApi.Migrations
{
    public partial class updatetable2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AboutMe_Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutMe_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Interest_Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Interest_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Profile_Users",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProfileUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profile_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Value_Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Value_Tags", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AboutMe_Tags",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Outgoing" },
                    { 2, "Introverted" },
                    { 3, "Energetic" },
                    { 4, "Adventurous" },
                    { 5, "Optimistic" },
                    { 6, "Thoughtful" }
                });

            migrationBuilder.InsertData(
                table: "Interest_Tags",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 2, "Cooking" },
                    { 3, "Gaming" },
                    { 4, "Photography" },
                    { 5, "Dancing" },
                    { 6, "Fitness" },
                    { 7, "Travel" }
                });

            migrationBuilder.InsertData(
                table: "Value_Tags",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Environmentalism" },
                    { 2, "Political activism" },
                    { 3, "Animal rights" },
                    { 4, "Family-oriented" },
                    { 5, "Volunteerism" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutMe_Tags");

            migrationBuilder.DropTable(
                name: "Interest_Tags");

            migrationBuilder.DropTable(
                name: "Profile_Users");

            migrationBuilder.DropTable(
                name: "Value_Tags");
        }
    }
}
