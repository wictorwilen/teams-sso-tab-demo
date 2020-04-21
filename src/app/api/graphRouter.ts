import express = require("express");
import passport = require("passport");
import { BearerStrategy, VerifyCallback, IBearerStrategyOption, ITokenPayload } from "passport-azure-ad";
import qs = require("querystring");
import Axios from "axios";
import * as debug from "debug";
const log = debug("graphRouter");

export const graphRouter = (options: any): express.Router => {
    const router = express.Router();

    // Set up the Bearer Strategy
    const bearerStrategy = new BearerStrategy({
        identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
        clientID: process.env.SSODEMO_APP_ID as string,
        audience: process.env.SSODEMO_APP_URI as string,
        loggingLevel: "warn",
        validateIssuer: false,
        passReqToCallback: false
    } as IBearerStrategyOption,
        (token: ITokenPayload, done: VerifyCallback) => {
            done(null, { tid: token.tid, name: token.name, upn: token.upn }, token);
        }
    );
    const pass = new passport.Passport();
    router.use(pass.initialize());
    pass.use(bearerStrategy);

    // Define a method used to exhchange the identity token to an access token
    const exchangeForToken = (tid: string, token: string, scopes: string[]): Promise<string> => {
        return new Promise((resolve, reject) => {
            const url = `https://login.microsoftonline.com/${tid}/oauth2/v2.0/token`;
            const params = {
                client_id: process.env.SSODEMO_APP_ID,
                client_secret: process.env.SSODEMO_APP_SECRET,
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion: token,
                requested_token_use: "on_behalf_of",
                scope: scopes.join(" ")
            };

            Axios.post(url,
                qs.stringify(params), {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(result => {
                if (result.status !== 200) {
                    reject(result);
                } else {
                    resolve(result.data.access_token);
                }
            }).catch(err => {
                // error code 400 likely means you have not done an admin consent on the app
                reject(err);
            });
        });
    };

    // Define the rout for the photo
    router.get(
        "/photo",
        pass.authenticate("oauth-bearer", { session: false }),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const user: any = req.user;
            try {
                const accessToken = await exchangeForToken(user.tid,
                    req.header("Authorization")!.replace("Bearer ", "") as string,
                    ["https://graph.microsoft.com/user.read"]);
                log(accessToken);
                Axios.get("https://graph.microsoft.com/v1.0/me/photo/$value", {
                    responseType: "arraybuffer",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(result => {
                    res.type("image/jpeg");
                    res.end(result.data, "binary");
                }).catch(err => {
                    res.status(500).send(err);
                });
            } catch (err) {
                if (err.status) {
                    res.status(err.status).send(err.message);
                } else {
                    res.status(500).send(err);
                }
            }

        });
    return router;
};
