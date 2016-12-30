import { Utils } from './core/helpers';

let configBase = {
	title: 'ImmiPlanner',
	description: 'Starting here a better life',
	name: 'immiplanner',
	defaultRoute:'dashboard',
	version:'0.0.1',
	tokenPrefix: 'immiplanner',
	analyticsId: 'UA-71612383-1',
	api : {
		prefix:'api',
		url: '/',
		loginUrl:'token',
		signupUrl: 'account/register',
		logoutUrl:'account/logout',
		profileUrl: 'me',
	}
}

let configForDevelopment = {
	analyticsId: "UA-71612383-1",
	api : {
    url: 'http://immiplanner.azurewebsites.net',
		clientId: "045A23D0-3859-42F1-A9CF-AE688EA0F030",
		clientSecret: "#$%ˆ&**()*()*)_)",
  },
	signalR : {
    host: 'http://immiplanner.azurewebsites.net/',
    logging :true
  },
	isInDebugMode: true,
	providers: {
		google: {
			clientId: '432486336848-earrujhbo5vb519kms0j65cpcaf9tdgc.apps.googleusercontent.com',
			secret:'fbXnqVE8WXLrKMFxQaGgiloW'
		}
		,
		linkedin:{
			clientId:'778mif8zyqbei7'
		},
		facebook:{
			clientId:'1452782111708498'
		}
	}
};

let configForProduction = {
	analyticsId: "UA-71612383-1",
	api : {
    url: 'http://localhost:9999/',
		clientId: "045A23D0-3859-42F1-A9CF-AE688EA0F030",
		clientSecret: "#$%ˆ&**()*()*)_)",
  },
	signalR : {
    host: 'http://localhost:1340',
    logging :false
  },
	isInDebugMode: false,
	providers: {
		google: {
			clientId: '239531826023-3ludu3934rmcra3oqscc1gid3l9o497i.apps.googleusercontent.com'
		}
		,
		linkedin:{
			clientId:'7561959vdub4x1'
		},
		facebook:{
			clientId:'1653908914832509'
		}

	}
};

let configEnv = (window.location.hostname==='localhost' ? configForDevelopment : configForProduction);

const config = Utils.merge(configBase, configEnv);

export { config as default };
