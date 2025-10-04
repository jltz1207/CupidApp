using System.ComponentModel.DataAnnotations;

namespace DatingWebApi.Model
{
    public class Id_Name
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Interest_Tag : Id_Name
    {
    }

    public class AboutMe_Tag : Id_Name
    {
    }

    public class Value_Tag : Id_Name
    {
    }

    public class Tone : Id_Name { }

    public class Word: Id_Name { }



}
