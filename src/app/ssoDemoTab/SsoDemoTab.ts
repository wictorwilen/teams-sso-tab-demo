import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/ssoDemoTab/index.html")
@PreventIframe("/ssoDemoTab/config.html")
@PreventIframe("/ssoDemoTab/remove.html")
export class SsoDemoTab {
}
