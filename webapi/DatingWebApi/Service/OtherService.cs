using DatingWebApi.Controllers;
using DatingWebApi.Data;
using DatingWebApi.Dto.Account;
using DatingWebApi.Form.Account;
using DatingWebApi.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using Python.Runtime;
using System.ComponentModel;
using System.Text;

namespace DatingWebApi.Service
{
    public class OtherService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static readonly Random _random = new Random();

        public OtherService(IHttpContextAccessor httpContextAccessor, IWebHostEnvironment hostingEnvironment, ApplicationDbContext context)
        {
            _context = context;

            _hostingEnvironment = hostingEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> UploadImage(IFormFile File, string folder, string? name)
        {
            try
            {
                if (File == null)
                {
                    return null;
                }
                string contentRootPath = _hostingEnvironment.ContentRootPath;

                string fileName = name != null ? name + Path.GetExtension(File.FileName)
                    : Path.GetFileName(File.FileName);

                string uploadsFolderPath = Path.Combine(contentRootPath, "Images", folder);

                Directory.CreateDirectory(uploadsFolderPath);

                var filePath = Path.Combine(uploadsFolderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create)) //problem
                {
                    await File.CopyToAsync(stream);
                }
                return filePath;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }

        }


        public void DeleteImage(string path)
        {
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }
        public void DeleteImages(List<string> paths)
        {
            foreach (string path in paths)
            {
                if (File.Exists(path))
                {
                    File.Delete(path);
                }
            }

        }


        public DateTime getHKTime()
        {
            DateTime utcNow = DateTime.UtcNow;
            TimeZoneInfo hktZone = TimeZoneInfo.FindSystemTimeZoneById("China Standard Time");
            DateTime hktTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, hktZone);
            return hktTime;
        }
        public int CalculateAge(DateTime birth)
        {
            DateTime currentDate = getHKTime();

            int age = currentDate.Year - birth.Year;

            if (birth.Date > currentDate.AddYears(-age)) age--;

            return age;
        }

        public async Task<UserDto_Detailed> getUserProfile(AppUser otherUser)
        {
            var result = new UserDto_Detailed
            {
                Bio = otherUser.Bio,
                Id = otherUser.Id,
                Name = otherUser.Name,
                Email = otherUser.Email,
                Age = CalculateAge(otherUser.Date_of_birth.HasValue ? otherUser.Date_of_birth.Value : new DateTime()),
                Gender = otherUser.Gender,
                ProfileFiles = new List<string>()
            };

            var interestIds = await _context.User_Interests.Where(x => x.UserId == otherUser.Id).Select(x => x.InterestId).ToListAsync();
            var aboutMeIds = await _context.User_AboutMes.Where(x => x.UserId == otherUser.Id).Select(x => x.AboutMeId).ToListAsync();
            var valueIds = await _context.User_Values.Where(x => x.UserId == otherUser.Id).Select(x => x.ValueId).ToListAsync();

            result.Interests = await _context.Interest_Tags.Where(x => interestIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            result.AboutMes = await _context.AboutMe_Tags.Where(x => interestIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            result.Values = await _context.Value_Tags.Where(x => interestIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();

            var profileList = await _context.Profile_Users.Where(x => x.UserId == otherUser.Id).Select(x => x.ProfileUrl).ToListAsync();
            HttpContext httpContext = _httpContextAccessor.HttpContext;
            var req = httpContext.Request;
            foreach (var profile in profileList)
            {

                string fileName = Path.GetFileName(profile);
                result.ProfileFiles.Add(String.Format("{0}://{1}{2}/Images/Profile/{3}/{4}", req.Scheme, req.Host, req.PathBase, otherUser.Id, fileName));
            }
            return result;
        }
        public async Task<object> returnDetails(AppUser user)
        {
            var userDetails = new
            {
                email = user.Email,
                name = user.Name,
                age = user.Date_of_birth.HasValue ? CalculateAge(user.Date_of_birth.Value) : 0,
                sex = user.Gender != null ? user.Gender == true ? "female" : "male" : null,

                bio = user.Bio,
                interestTagId = await _context.User_Interests.Where(x => x.UserId == user.Id).Select(x => x.InterestId).ToListAsync(),
                aboutMeTagId = await _context.User_AboutMes.Where(x => x.UserId == user.Id).Select(x => x.AboutMeId).ToListAsync(),
                valueTagId = await _context.User_Values.Where(x => x.UserId == user.Id).Select(x => x.ValueId).ToListAsync(),

                interestKeywords = await _context.Keywords.Where(x => x.UserId == user.Id && x.CategoryId == 1).Select(x => x.Keywords).ToListAsync(),
                personalityKeywords = await _context.Keywords.Where(x => x.UserId == user.Id && x.CategoryId == 2).Select(x => x.Keywords).ToListAsync(),
                hatePersonalityKeywords = await _context.Keywords.Where(x => x.UserId == user.Id && x.CategoryId == 3).Select(x => x.Keywords).ToListAsync(),
            };


            //string jsonData = JsonConvert.SerializeObject(userDetails);
            return userDetails;
        }

        public async Task<List<string>> getUserProfileBytes(string userId)
        {
            var paths = await _context.Profile_Users.Where(x => x.UserId == userId).Select(x => x.ProfileUrl).ToListAsync();
            var contents = new List<string>();
            foreach (var path in paths)
            {
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                string base64File = Convert.ToBase64String(fileBytes);
                contents.Add(base64File);
            }
           return contents;
        }
        public string RunPythonScript(string script, string method)
        {
            Runtime.PythonDLL = @"C:\Users\jason.thlee\AppData\Local\Programs\Python\Python311\python311.dll";
            PythonEngine.Initialize();
            using (Py.GIL())
            {
                dynamic sys = Py.Import("sys");
                var scriptFolderPath = @"C:\Users\jason.thlee\source\repos\DatingWebApi\DatingWebApi\Script";
                sys.path.append(scriptFolderPath); // Append the correct folder path before importing

                try
                {
                    dynamic pythonScript = Py.Import("pythonScript");
                    dynamic result = pythonScript.InvokeMethod(method);
                    return result.ToString();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return null; // Return null or handle the error appropriately
                }
            }
        }
        public  string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var stringBuilder = new StringBuilder();
            for (int i = 0; i < length; i++)
            {
                stringBuilder.Append(chars[_random.Next(chars.Length)]);
            }
            return stringBuilder.ToString();
        }

        public (string, string) GenerateRandomName(int sex) //male=0, female =1
        {
            var MaleFirstNames = new List<string>
{
    "Jason", "Michael", "David", "James", "Matthew", "John", "Robert", "Daniel", "William", "Joseph",
    "Andrew", "Brian", "Christopher", "Kevin", "Joshua", "Anthony", "Justin", "Nathan", "Ryan", "Thomas",
    "Charles", "Mark", "Paul", "Steven", "George", "Edward", "Kenneth", "Richard", "Timothy", "Scott",
    "Jeffrey", "Brandon", "Patrick", "Gregory", "Benjamin", "Samuel", "Eric", "Frank", "Gary", "Larry",
    "Stephen", "Raymond", "Jerry", "Dennis", "Walter", "Peter", "Aaron", "Adam", "Zachary", "Kyle",
    "Alexander", "Nicholas", "Jacob", "Austin", "Ethan", "Dylan", "Tyler", "Sean", "Cameron", "Christian",
    "Evan", "Gabriel", "Henry", "Ian", "Jack", "Jackson", "Jordan", "Jose", "Logan", "Lucas",
    "Luis", "Mason", "Max", "Nathaniel", "Noah", "Owen", "Patrick", "Philip", "Robert", "Riley",
    "Samuel", "Seth", "Spencer", "Stephen", "Theodore", "Tristan", "Victor", "Vincent", "Wyatt", "Xavier",
    "Zachary", "Aiden", "Blake", "Bradley", "Brendan", "Brett", "Bryan", "Caleb", "Carter", "Chase",
    "Cole", "Colin", "Connor", "Damian", "Derek", "Dominic", "Donovan", "Dustin", "Elijah", "Elliot",
    "Emmett", "Ezekiel", "Finn", "Gavin", "Grant", "Grayson", "Harrison", "Hunter", "Isaac", "Jace",
    "Jasper", "Jayden", "Jonah", "Jude", "Kaden", "Kai", "Kayden", "Kingston", "Landon", "Levi",
    "Liam", "Lincoln", "Malachi", "Miles", "Nolan", "Parker", "Preston", "Quinn", "Ryder", "Sawyer",
    "Silas", "Tanner", "Tucker", "Wesley", "Zane"
};

            var FemaleFirstNames = new List<string>
{
    "Emily", "Jessica", "Sarah", "Amanda", "Hannah", "Ashley", "Samantha", "Elizabeth", "Taylor", "Lauren",
    "Alyssa", "Kayla", "Megan", "Rachel", "Nicole", "Stephanie", "Jennifer", "Emma", "Olivia", "Sophia",
    "Isabella", "Mia", "Abigail", "Madison", "Chloe", "Ella", "Grace", "Ava", "Lily", "Victoria",
    "Natalie", "Anna", "Brianna", "Savannah", "Hailey", "Jasmine", "Allison", "Brooklyn", "Samantha", "Julia",
    "Katherine", "Alexis", "Madeline", "Ariana", "Rebecca", "Caroline", "Evelyn", "Zoe", "Claire", "Gabriella",
    "Layla", "Aubrey", "Addison", "Lillian", "Nora", "Riley", "Scarlett", "Stella", "Aria", "Mila",
    "Lucy", "Ellie", "Audrey", "Aurora", "Hazel", "Violet", "Penelope", "Luna", "Eleanor", "Isla",
    "Nina", "Paige", "Gianna", "Lydia", "Peyton", "Ruby", "Sadie", "Serenity", "Valeria", "Vivian",
    "Willow", "Sienna", "Mackenzie", "Maya", "Naomi", "Delilah", "Eliana", "Faith", "Harper", "Ivy",
    "Jade", "Jocelyn", "Kennedy", "Kylie", "Leah", "Lila", "Molly", "Piper", "Reagan", "Skylar",
    "Sydney", "Tessa", "Trinity", "Adeline", "Alyson", "Bailey", "Brooklynn", "Cora", "Dakota", "Daisy",
    "Eden", "Elena", "Fiona", "Gemma", "Harmony", "Holly", "Hope", "Jordyn", "June", "Kaitlyn",
    "Kendall", "Kimberly", "Leilani", "Lola", "Marley", "Melanie", "Miranda", "Morgan", "Paisley", "Quinn",
    "Reese", "Sabrina", "Savanna", "Selena", "Sophie", "Teagan", "Tiffany", "Vanessa", "Wendy", "Wren"
};

            var LastNames = new List<string>
{
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
    "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
    "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
    "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",
    "Powell", "Jenkins", "Perry", "Russell", "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes",
    "Gonzales", "Fisher", "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham",
    "Reynolds", "Griffin", "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant", "Herrera", "Gibson",
    "Ellis", "Tran", "Medina", "Aguilar", "Stevens", "Murray", "Ford", "Castro", "Marshall", "Owens",
    "Harrison", "Fernandez", "McDonald", "Woods", "Washington", "Kennedy", "Wells", "Vargas", "Henry", "Chen",
    "Freeman", "Webb", "Tucker", "Guzman", "Burns", "Cummings", "Mann", "Sharp", "Bowen", "Daniel",
    "Barber", "Caldwell", "Fuller", "Hart", "Jacobs", "Knight", "Lawrence", "Maxwell", "Nash", "Phelps",
    "Quinn", "Reeves", "Summers", "Tate", "Vaughn", "Watts", "Woodward", "York", "Zimmerman"
};

            string firstName;
            if (sex == 0) // male
            {
                 firstName = MaleFirstNames[_random.Next(MaleFirstNames.Count)];
            }
            else { // female
                 firstName = FemaleFirstNames[_random.Next(FemaleFirstNames.Count)];
            }
            string lastName = LastNames[_random.Next(LastNames.Count)];


            return (firstName,lastName);

        }

        public string GenerateRandomEmail(string firstName, string lastName)
        {
            var randStr = GenerateRandomString(5);
            return $"{firstName}{lastName}{randStr}@test.com";
        }

        public  DateTime GenerateRandomDate(DateTime startDate, DateTime endDate)
        {
            int range = (endDate - startDate).Days;
            return startDate.AddDays(_random.Next(range));
        }

        public  List<int> GenerateRandomIdList(int count, int min, int max)
        {
            if (count > (max - min + 1))
            {
                throw new ArgumentException("Count is greater than the range of unique numbers available.");
            }

            var uniqueIds = new HashSet<int>();
            while (uniqueIds.Count < count)
            {
                int randomId = _random.Next(min, max + 1);
                uniqueIds.Add(randomId);
            }

            return new List<int>(uniqueIds);
        }

        public async Task<string> getBioPromp(int Sex,List<int> InterestIds, List<int> ValueIds, List<int> AboutMeIds, string? LookingFor, string? OtherDetails)
        {
            var userInterests = await _context.Interest_Tags.Where(x => InterestIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            var userValues = await _context.Value_Tags.Where(x => ValueIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();
            var userAboutMes = await _context.AboutMe_Tags.Where(x => AboutMeIds.Contains(x.Id)).Select(x => x.Name).ToListAsync();

            var userInformation_Msg = $"Interests: {string.Join(", ", userInterests)}\n"
                                    + $"Values: {string.Join(", ", userValues)}\n"
                                    + $"About Mes: {string.Join(", ", userAboutMes)}\n";

            var result = "Give me the Bio description directly for dating App without any introductory text or quotation marks? Here is the details for the current User" +
                $"Gender:{(Sex==1 ? "Female" : "Male")}" +
                $"{(string.IsNullOrEmpty(LookingFor) ? "" : $"Looking For: {LookingFor}")}" +
                $"{(string.IsNullOrEmpty(OtherDetails) ? "" : $"Other details: {OtherDetails}")}"
                + userInformation_Msg;

            return result;
        }

    }
}
