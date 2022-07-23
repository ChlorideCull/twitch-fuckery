import twitchAPI from "./twitchapi";
import cs from "./contentscriptsec";
import {ChannelPointsContext} from "./TwitchGraphQLEntities";

const cookies = cs.document.cookie.split(";");
const cookie = cookies.find(x => x.startsWith(" twilight-user"));
if (cookie == undefined) {
    throw new Error("Failed to find user cookie");
}
const twilightCookie = JSON.parse(decodeURI(cookie).split("=")[1].replaceAll("%2C", ","));

twitchAPI.setAccessToken(twilightCookie.authToken);

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function getChannelPointsContext(channel: string): Promise<ChannelPointsContext> {
	var req = await twitchAPI.graphqlQuery({
		"extensions": {
			"persistedQuery": {
				  "sha256Hash": "1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024",
			  "version": 1
			}
		  },
		"operationName": "ChannelPointsContext"
	}, {
		"channelLogin": channel,
		"includeGoalTypes": [ "CREATOR", "BOOST" ]
	});
	var json = await req.json();
	return json[0].data;
}

(<any>cs.window).redeemRewardNTimes = cs.exposeFunction(async function(channel: string, rewardTitle: string, repeat: number) {
	var context = await getChannelPointsContext(channel);
	
	var reward = context.community.channel.communityPointsSettings.customRewards.find(x => x.title.toLowerCase().trim() == rewardTitle.toLowerCase().trim());
	if (!reward) {
		throw new Error("Could not find reward!");
	}
	if (!reward.isEnabled) {
		throw new Error("Reward is not enabled!");
	}
	if (!reward.isInStock) {
		throw new Error("Reward is not in stock!");
	}
	if (reward.isPaused) {
		throw new Error("Reward is paused!");
	}
	if (reward.isUserInputRequired) {
		throw new Error("Reward needs user input!");
	}
	if (reward.globalCooldownSetting.isEnabled || reward.maxPerStreamSetting.isEnabled || reward.maxPerUserPerStreamSetting.isEnabled) {
		throw new Error("Reward has throttling enabled!");
	}

	let rewardId: string = reward.id;
	let channelId: string = context.community.channel.id;
	let cost: number = reward.cost;
	let title: string = reward.title;
	let prompt: string | null = reward.prompt;

	for (let i = 0; i < repeat; i++) {
		const arr = new Uint8Array(16);
		crypto.getRandomValues(arr);
		const transactionId = [...arr].map(x => x.toString(16).padStart(2, '0')).join("");
		
		await twitchAPI.graphqlQuery({
			"extensions": {
				"persistedQuery": {
					  "sha256Hash": "d56249a7adb4978898ea3412e196688d4ac3cea1c0c2dfd65561d229ea5dcc42",
				  "version": 1
				}
			  },
			"operationName": "RedeemCustomReward"
		}, {
			"input": {
				"channelID": channelId,
				"cost": cost,
				"prompt": prompt,
				"rewardID": rewardId,
				"title": title,
				"transactionID": transactionId
			}
		});
		await delay(100);
	}

	return;
});