using Newtonsoft.Json;
using SteamAuth;
using System;
using System.Collections.Generic;
using System.IO;

namespace accountLinker
{
    internal class Program
    {
        static void Main(string[] args)
        {
            signIn(args[0], args[1]);
        }

        private static void signIn(String loginStr, String passStr)
        {
            var roamingDir = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "/steam-guard/accounts/";


            var userLogin = new UserLogin(loginStr, passStr);

            LoginResult response = LoginResult.BadCredentials;
            var emcode = "";

            while ((response = userLogin.DoLogin()) != LoginResult.LoginOkay)
            {
                switch (response)
                {
                    case LoginResult.NeedEmail:

                        sendLine("1@INPUT@EMAIL");

                        String emailcdc = Console.ReadLine();

                        userLogin.EmailCode = emailcdc;
                        emcode = emailcdc;
                        break;

                    case LoginResult.NeedCaptcha:

                        sendLine("1@ERR@CAPTCHA");

                        return;

                    case LoginResult.Need2FA:

                        sendLine("1@ERR@2FA");

                        return;

                    case LoginResult.BadRSA:

                        sendLine("1@ERR1");

                        return;

                    case LoginResult.BadCredentials:

                        sendLine("1@ERR@LOP");

                        return;

                    case LoginResult.TooManyFailedLogins:

                        sendLine("1@ERR@TOOMANY");

                        return;

                    case LoginResult.GeneralFailure:

                        sendLine("1@ERR@LOP");

                        return;
                }
            }

            SessionData session = userLogin.Session;
            AuthenticatorLinker linker = new AuthenticatorLinker(session);
            AuthenticatorLinker.LinkResult linkResponse = AuthenticatorLinker.LinkResult.GeneralFailure;

            while ((linkResponse = linker.AddAuthenticator()) != AuthenticatorLinker.LinkResult.AwaitingFinalization)
            {
                switch (linkResponse)
                {
                    case AuthenticatorLinker.LinkResult.MustProvidePhoneNumber:

                        sendLine("1@ERR@PHONE");

                        return;
                }
            }

            string json = JsonConvert.SerializeObject(linker.LinkedAccount, Formatting.Indented);
            var path = roamingDir + loginStr + ".json";

            if (!File.Exists(path))
            {
                File.WriteAllText(path, json);
            }
            else
            {
                File.Delete(path);
                File.WriteAllText(path, json);
            }

            var values = JsonConvert.DeserializeObject<Dictionary<string, object>>(File.ReadAllText(path));
            values.Add("password", passStr);
            json = JsonConvert.SerializeObject(values, Formatting.Indented);

            File.Delete(path);
            File.WriteAllText(path, json);

            AuthenticatorLinker.FinalizeResult finalizeResponse = AuthenticatorLinker.FinalizeResult.GeneralFailure;

            while (finalizeResponse != AuthenticatorLinker.FinalizeResult.Success)
            {

                sendLine("2@INPUT@SMS");

                string smsCode = Console.ReadLine();

                finalizeResponse = linker.FinalizeAddAuthenticator(smsCode);

                switch (finalizeResponse)
                {
                    case AuthenticatorLinker.FinalizeResult.BadSMSCode:

                        sendLine("2@ERR@SMS");

                        continue;

                    case AuthenticatorLinker.FinalizeResult.UnableToGenerateCorrectCodes:

                        sendLine("2@ERR");

                        return;

                    case AuthenticatorLinker.FinalizeResult.GeneralFailure:

                        sendLine("2@ERR");

                        return;
                }

            }

            sendLine("SUCCESS");

        }

        private static void sendLine(String code)
        {
            Console.WriteLine(code);
            Console.Out.Flush();
        }
    }
}
