import { FrameworkConfiguration } from 'aurelia-framework';
import { RequestBuilder } from 'aurelia-http-client';
import { HttpClientExtensions } from 'core/Helpers';

export function configure(config: FrameworkConfiguration) {
	let httpClientExtensions = config.container.get(HttpClientExtensions);
	httpClientExtensions.configure();
	config.globalResources('./AuthFilter', './AuthLevelAttribute');
};
