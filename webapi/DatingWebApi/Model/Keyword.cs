using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Model
{
    public class Keyword
    {
        public int CategoryId { get; set; }
        public string UserId { get; set; }
        public string Keywords { get; set; }
    }
}
