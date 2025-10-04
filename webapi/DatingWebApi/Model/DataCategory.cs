using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Model
{
    public class DataCategory
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }    
    }
}
