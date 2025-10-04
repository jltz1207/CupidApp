using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingWebApi.Migrations
{
    public partial class addnewcol : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Read_TimeStamp",
                table: "Messages",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Read_TimeStamp",
                table: "Messages");
        }
    }
}
