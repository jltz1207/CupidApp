using DatingWebApi.Data;
using DatingWebApi.Form.Report;
using DatingWebApi.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DatingWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public ReportController(ApplicationDbContext context, UserManager<AppUser> userManager) {
            _context = context;
            _userManager = userManager;

        }

        [HttpGet("getCategories")]
        public async Task<IActionResult> getCategories()
        {
            var cats = await _context.ReportCategories.ToListAsync();
            return Ok(cats);
        }


        [HttpPost("submitReport")]
        public async Task<IActionResult> submitReport(ReportUserForm form)
        {
            var emailClaim = User.FindFirstValue(ClaimTypes.Email);
            if (emailClaim == null)
            {
                return Unauthorized(); // or handle accordingly
            }
            var user = await _userManager.FindByEmailAsync(emailClaim);

            if (user == null)
            {
                return NotFound();
            }
           // await _context.ReportUser.
            return Ok();
        }
    }
}
