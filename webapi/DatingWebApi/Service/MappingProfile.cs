using AutoMapper;
using DatingWebApi.Dto.Account;
using DatingWebApi.Form.Account;
using DatingWebApi.Model;

namespace DatingWebApi.Service
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<AppUser, AccountFormDto>();
        }
    }
}
