/* SPDX-License-Identifier: BSD-3-Clause */
/* Copyright (c) 2025 Bjoern Boss Henrichsen */
import * as libCommon from "core/common.js";
import * as libClient from "core/client.js";
import * as libLocation from "core/location.js";
import * as libLog from "core/log.js";

/*
*	Dispatch modules to live at separate sub-paths
*	Matches against longest match (directory-aligned)
*/
export class PathDispatch implements libCommon.ModuleInterface {
	private mapping: Record<string, libCommon.ModuleInterface>;

	public name: string = 'path-dispatch';
	constructor(mapping: Record<string, libCommon.ModuleInterface>) {
		this.mapping = {};
		for (const path in mapping) {
			libLog.Log(`Mapping [${mapping[path].name}] to [${path}]`);
			this.mapping[libLocation.Sanitize(path)] = mapping[path];
		}
	}

	private dispatch(client: libClient.HttpBaseClass): libCommon.ModuleInterface | null {
		let bestMatch: string | null = null;

		/* iterate over the mappings and look for the corresponding best handler */
		for (const path in this.mapping) {
			if (!libLocation.IsSubDirectory(path, client.path))
				continue;
			if (bestMatch == null || bestMatch.length < path.length)
				bestMatch = path;
		}

		/* check if a handler has been found and translate the path accordingly */
		if (bestMatch != null) {
			client.log(`Client dispatched to handler [${this.mapping[bestMatch].name}] at [${bestMatch}]`);
			client.translate(bestMatch);
			return this.mapping[bestMatch];
		}

		/* add the not found error */
		client.log(`Request cannot be dispatched`);
		client.respondNotFound();
		return null;
	}

	public request(client: libClient.HttpRequest): void {
		const module = this.dispatch(client);
		if (module != null)
			module.request(client);
	}
	public upgrade(client: libClient.HttpUpgrade): void {
		const module = this.dispatch(client);
		if (module != null)
			module.upgrade(client);
	}
};
