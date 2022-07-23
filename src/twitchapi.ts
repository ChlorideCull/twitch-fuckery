// heavily inspired from https://github.com/night/betterttv/blob/72d37f3fd1d97069def7aa8755d729c33b5a347f/src/utils/twitch-api.js
import cs from "./contentscriptsec";

const GQL_ENDPOINT = 'https://gql.twitch.tv/gql';
const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';

let accessToken: string;

function request(method: string, options: any) {
    var headers = {};
    (<any>headers)["Client-ID"] = CLIENT_ID;
    if (options.auth && accessToken) {
      (<any>headers)["Authorization"] = `OAuth ${accessToken}`;
    }

    return cs.fetch(GQL_ENDPOINT, {
        method: method,
        body: options.body ? JSON.stringify(options.body) : null,
        headers: headers
    });
}

export default {
  setAccessToken(newAccessToken: string) {
    accessToken = newAccessToken;
  },

  graphqlQuery(query: Array<object> | object, variables: object) {
    if (accessToken == null) {
      return Promise.reject(new Error('unset accessToken'));
    }

    let body;
    if (Array.isArray(query)) {
      body = query;
      if (variables) {
        throw new Error('variables cannot be specified with array of queries');
      }
    } else {
      body = [query];
      if (variables) {
        (<any>body[0]).variables = variables;
      }
    }

    return request('POST', {
      body,
      auth: true,
    });
  },
};
