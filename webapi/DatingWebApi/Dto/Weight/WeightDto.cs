namespace DatingWebApi.Dto.Weight
{
    public class WeightDto
    {
        public double cosine_similarity { get; set; }
        public double common_interest_tags { get; set; }
        public double common_about_me_tags { get; set; }
        public double common_value_tags { get; set; }
        public double hate_keywords { get; set; }

        public double age_as_expected { get; set; }
    }
}
