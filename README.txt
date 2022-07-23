only tested on firefox (which has additional security for content scripts and thus user scripts)

to build, do yarn install, then do yarn rollup -c
remove the "(function () {" from the start of twitch.js and "})();" from the end, then prepend the following:

// ==UserScript==
// @name     Quick Redeem Rewards
// @version  1
// @match    https://www.twitch.tv/*/
// @match    https://www.twitch.tv/*
// @grant    none
// ==/UserScript==

to use, call "window.redeemRewardNTimes" from your browser console with the channel name as the first parameter, the name of the reward as the second parameter, and number of redeems as the third parameter

abusing this is a great way to get banned from twitch, by the way - it's plainly obvious from timing it's done by a script
