# Microsoft Teams SSO Tab demo

This is demo code for an SSO Tab. For full tutorial on how to configure the apps see

1. [Build a Tab with Single-Sign-On Support](https://github.com/pnp/generator-teams/wiki/Build-a-Tab-with-SSO-support)
2. [Microsoft Teams Tabs SSO and Microsoft Graph - the "on-behalf-of" blog post](http://www.wictorwilen.se/microsoft-teams-tabs-sso-and-microsoft-graph-the-on-behalf-of-blog-post)

## The `.env` file

In order to get this demo to work you need to create and configure a `.env` file in the root folder. It should have the following contents:

```
# The domain name of where you host your application
HOSTNAME=<YOUR FQDN>
PORT=3007
SECURITY_TOKEN=
CONNECTOR_ID=
mpty for anonymous)
NGROK_AUTH=<YOUR NGROK AUTH SETTINGS>
NGROK_SUBDOMAIN=<YOUR NGROK SUBDOMAIN>
NGROK_REGION=
DEBUG=msteams graphRouter

SSODEMO_APP_ID=<YOUR TAB CLIENT ID>
SSODEMO_APP_URI=<YOUR TAB APPLICATION ID URI>
SSODEMO_APP_SECRET=<YOUR TAB CLIENT SECRET>

```
