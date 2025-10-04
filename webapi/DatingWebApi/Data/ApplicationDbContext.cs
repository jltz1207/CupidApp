using DatingWebApi.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Pqc.Crypto.Bike;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace DatingWebApi.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public virtual DbSet<Interest_Tag> Interest_Tags { get; set; } = null;
        public virtual DbSet<AboutMe_Tag> AboutMe_Tags { get; set; } = null;
        public virtual DbSet<Value_Tag> Value_Tags { get; set; } = null;
        public virtual DbSet<AppUser> AspNetUsers { get; set; } = null;
        public virtual DbSet<Profile_User> Profile_Users { get; set; } = null;

        public virtual DbSet<User_Interest> User_Interests { get; set; } = null;
        public virtual DbSet<User_AboutMe> User_AboutMes { get; set; } = null;
        public virtual DbSet<User_Value> User_Values { get; set; } = null;

        public virtual DbSet<UserLike> UserLikes { get; set; } = null;
        public virtual DbSet<Match> Matches { get; set; } = null;
        public virtual DbSet<Message> Messages { get; set; } = null;

        public virtual DbSet<GptMessage> GptMessages { get; set; } = null;
        public virtual DbSet<DataCategory> DataCategories { get; set; } = null;
        public virtual DbSet<GptRole> GptRoles { get; set; } = null;

        public virtual DbSet<ReportUser> ReportUsers { get; set; } = null;
        public virtual DbSet<ReportCategory> ReportCategories { get; set; } = null;

        public virtual DbSet<Rate> Rates { get; set; } = null;
        public virtual DbSet<RateCategory> RateCategories { get; set; } = null;
        public virtual DbSet<Keyword> Keywords { get; set; } = null;

        public virtual DbSet<Weight> Weights{ get; set; } = null;


        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<RateCategory>().HasData(
          new RateCategory { Id = 1, Name = "AI Reply Funtion" },
         new RateCategory { Id = 2, Name = "Face Match Function" },
         new RateCategory { Id = 3, Name = "Assist Bot" },
         new RateCategory { Id = 4, Name = "Cupid Bot" },
         new RateCategory { Id = 5, Name = "Match" },
         new RateCategory { Id = 6, Name = "AI Bio Fuction" }


          );

            modelBuilder.Entity<ReportCategory>().HasData(
           new ReportCategory { Id = 1, Name = "Inappropriate Content" },
          new ReportCategory { Id = 2, Name = "Harassment and Abuse" },
          new ReportCategory { Id = 3, Name = "Spam or Misleading Behavior" },
          new ReportCategory { Id = 4, Name = "Profile Issues" },
          new ReportCategory { Id = 5, Name = "Offensive or Inappropriate Behavior" },
          new ReportCategory { Id = 6, Name = "Safety Concerns" },
          new ReportCategory { Id = 7, Name = "Intellectual Property Violations" },
          new ReportCategory { Id = 8, Name = "Privacy Violations" },
          new ReportCategory { Id = 9, Name = "Others" }


           );

            modelBuilder.Entity<Interest_Tag>().HasData(
            new Interest_Tag { Id = 7, Name = "Travel" },
           new Interest_Tag { Id = 2, Name = "Cooking" },
           new Interest_Tag { Id = 3, Name = "Gaming" },
           new Interest_Tag { Id = 4, Name = "Photography" },
           new Interest_Tag { Id = 5, Name = "Dancing" },
           new Interest_Tag { Id = 6, Name = "Fitness" }
            );

            modelBuilder.Entity<AboutMe_Tag>().HasData(
                   new AboutMe_Tag { Id = 1, Name = "Outgoing" },
                    new AboutMe_Tag { Id = 2, Name = "Introverted" },
           new AboutMe_Tag { Id = 3, Name = "Energetic" },
           new AboutMe_Tag { Id = 4, Name = "Adventurous" },
           new AboutMe_Tag { Id = 5, Name = "Optimistic" },
           new AboutMe_Tag { Id = 6, Name = "Thoughtful" }
                );




            modelBuilder.Entity<Value_Tag>().HasData(
                   new Value_Tag { Id = 1, Name = "Environmentalism" },
                    new Value_Tag { Id = 2, Name = "Political activism" },
           new Value_Tag { Id = 3, Name = "Animal rights" },
           new Value_Tag { Id = 4, Name = "Family-oriented" },
           new Value_Tag { Id = 5, Name = "Volunteerism" }
                );

            modelBuilder.Entity<DataCategory>().HasData(
                new DataCategory { Id = 1, Name = "Interest" },
                 new DataCategory { Id = 2, Name = "Personality" },
                 new DataCategory { Id = 3, Name = "Hate Personality" }

             );
            modelBuilder.Entity<GptRole>().HasData(
                new GptRole { Id = 1, Name = "System" },
                 new GptRole { Id = 2, Name = "Asistant" },
                 new GptRole { Id = 3, Name = "User" }

             );

            modelBuilder.Entity<User_Interest>().HasKey(x => new { x.UserId, x.InterestId });
            modelBuilder.Entity<User_AboutMe>().HasKey(x => new { x.UserId, x.AboutMeId });
            modelBuilder.Entity<User_Value>().HasKey(x => new { x.UserId, x.ValueId });



            modelBuilder.Entity<Profile_User>().HasKey(x => new { x.UserId, x.ProfileUrl });
            modelBuilder.Entity<UserLike>().HasKey(x => new { x.LikeUserId, x.LikedUserId });
            modelBuilder.Entity<Match>().HasKey(x => new { x.UserId1, x.UserId2 });

            modelBuilder.Entity<Keyword>().HasKey(x => new { x.CategoryId, x.UserId, x.Keywords });



        }
    }
}