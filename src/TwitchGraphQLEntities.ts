export interface ChannelPointsContext {
    community: {
        id: string;
        displayName: string;
        channel: {
            id: string;
            communityPointsSettings: {
                name: string;
                customRewards: Array<{
                    id: string;
                    backgroundColor: string;
                    cooldownExpiresAt: any;
                    cost: number;
                    isEnabled: boolean;
                    isInStock: boolean;
                    isPaused: boolean;
                    isSubOnly: boolean;
                    isUserInputRequired: boolean;
                    maxPerStreamSetting: {
                        isEnabled: boolean;
                        maxPerStream: number;
                    };
                    maxPerUserPerStreamSetting: {
                        isEnabled: boolean;
                        maxPerUserPerStream: number;
                    };
                    globalCooldownSetting: {
                        isEnabled: boolean;
                        globalCooldownSeconds: number;
                    };
                    title: string;
                    prompt: string | null;
                }>;
            }
        }
    };

}

interface User {

}