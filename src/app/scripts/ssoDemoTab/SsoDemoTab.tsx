import * as React from "react";
import { Provider, Flex, Text, Button, Header, Image } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import * as jwt from "jsonwebtoken";
import Axios from "axios";

/**
 * State for the ssoDemoTabTab React component
 */
export interface ISsoDemoTabState extends ITeamsBaseComponentState {
    entityId?: string;
    name?: string;
    error?: string;
    image?: any;
}

/**
 * Properties for the ssoDemoTabTab React component
 */
export interface ISsoDemoTabProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of the SSO Demo content page
 */
export class SsoDemoTab extends TeamsBaseComponent<ISsoDemoTabProps, ISsoDemoTabState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        microsoftTeams.initialize(() => {
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                this.setState({
                    entityId: context.entityId
                });
                this.updateTheme(context.theme);

                microsoftTeams.authentication.getAuthToken({
                    successCallback: (token: string) => {
                        const decoded: { [key: string]: any; } = jwt.decode(token) as { [key: string]: any; };
                        this.setState({ name: decoded!.name });
                        Axios.get(`https://${process.env.HOSTNAME}/api/photo`, {
                            responseType: "blob",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }).then(result => {
                            // tslint:disable-next-line: no-console
                            const r = new FileReader();
                            r.readAsDataURL(result.data);
                            r.onloadend = () => {
                                if (r.error) {
                                    alert(r.error);
                                } else {
                                    this.setState({ image: r.result });
                                }
                            };
                        });
                    },
                    failureCallback: (reason: string) => {
                        this.setState({ error: reason });
                    },
                    resources: [process.env.SSODEMO_APP_URI as string]
                });
            });
        });
    }

    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex fill={true} column styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <Flex.Item>
                        <Header content="This is your tab" />
                    </Flex.Item>
                    <Flex.Item>
                        <div>

                            <div>
                                <Image avatar src={this.state.image} styles={{ padding: "5px" }} /><Text content={`Hello ${this.state.name}`} />
                            </div>
                            {this.state.error && <div><Text content={`An SSO error occurred ${this.state.error}`} /></div>}

                            <div>
                                <Button onClick={() => alert("It worked!")}>A sample button</Button>
                            </div>
                        </div>
                    </Flex.Item>
                    <Flex.Item styles={{
                        padding: ".8rem 0 .8rem .5rem"
                    }}>
                        <Text size="smaller" content="(C) Copyright Wictor Wilén" />
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
