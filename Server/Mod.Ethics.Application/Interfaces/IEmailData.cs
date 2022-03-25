using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Services
{ 
    public interface IEmailData<TDto>
    {
        Dictionary<string, string> GetEmailData(TDto dto);
        Dictionary<string, string> GetEmailFieldsDef(Dictionary<string, string> dict);
    }
}
