using Newtonsoft.Json;
using SteamAuth;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace codeGenerator
{
    internal class Program
    {
        static void Main(string[] args)
        {
            List<string> guards = new List<string>();
            String roaming = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/steam-guard/accounts";
            Directory.CreateDirectory(roaming);
            foreach (var jsonString in Directory.GetFiles(roaming))
            {
                var values = JsonConvert.DeserializeObject<Dictionary<string, object>>(File.ReadAllText(jsonString));
                SteamGuardAccount sgg = new SteamGuardAccount();
                sgg.SharedSecret = (string)values["shared_secret"];
                sgg.AccountName = (string)values["account_name"];
                sgg.SerialNumber = (string)values["serial_number"];
                sgg.RevocationCode = (string)values["revocation_code"];
                sgg.Status = (int)(long)values["status"];
                sgg.Secret1 = (string)values["secret_1"];
                sgg.IdentitySecret = (string)values["identity_secret"];
                sgg.TokenGID = (string)values["token_gid"];
                sgg.URI = (string)values["uri"];
                sgg.DeviceID = (string)values["device_id"];
                guards.Add($"{(string)values["account_name"]}@{sgg.GenerateSteamGuardCode()}");
            }
            foreach (var code in guards)
            {
                Console.WriteLine(code);
                Console.Out.Flush();
            }
            Task.Delay(2000).Wait();
        }
    }
}
