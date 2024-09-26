import { CavrnusFunctionLibrary, CavrnusSpace, CavrnusUser, Hook, RgbaColor, CavrnusSpaceConnection } from "@cavrnus/csc";

export class CavrnusSpatialConnector
{
	cavrnusFunctionLibrary = new CavrnusFunctionLibrary();

	public async authenticateWithPassword(apiEndpoint: string, email: string, password: string): Promise<void>
	{
		try
		{
			await this.cavrnusFunctionLibrary.authenticateWithPassword(apiEndpoint, email, password);
			console.log("Authenticated as user");
		}
		catch (err)
		{
			throw err;
		}
	}

	public async authenticateAsGuest(apiEndpoint: string, screenName: string): Promise<void>
	{
		try
		{
			await this.cavrnusFunctionLibrary.authenticateAsGuest(apiEndpoint, screenName);
			console.log("Authenticated as guest");
		}
		catch (err)
		{
			throw err;
		}
	}

	public awaitAnySpaceConnection()
	{
		try
		{
			const promise = this.cavrnusFunctionLibrary.awaitAnySpaceConnection();
		}
		catch (err)
		{
			throw err;
		}
	}

	public awaitAnySpaceBeginLoading()
	{
		try
		{
			const promise = this.cavrnusFunctionLibrary.awaitAnySpaceBeginLoading();
			console.log("Awaiting space loading", promise);
		}
		catch (err)
		{
			throw err;
		}
	}

	public awaitAuthentication()
	{
		try
		{
			const promise = this.cavrnusFunctionLibrary.awaitAuthentication();
		}
		catch (err)
		{
			throw err;
		}
	}

	public awaitLocalUser(spaceConnection: CavrnusSpaceConnection)
	{
		try
		{
			this.cavrnusFunctionLibrary.awaitLocalUser(spaceConnection);
		}
		catch (err)
		{
			throw err;
		}
	}

	public async joinSpace(roomId: string, clientId?: string): Promise<CavrnusSpaceConnection>
	{
		try
		{
			const spaceConn = await this.cavrnusFunctionLibrary.joinSpace(roomId, clientId ? clientId : "sample-app");
			console.log("Joined space successfully");

			return spaceConn;
		}
		catch (err)
		{
			throw err;
		}
	}

	public async fetchJoinableSpaces(spaceConnection: CavrnusSpaceConnection): Promise<CavrnusSpace[]>
	{
		try
		{
			const spaces = await this.cavrnusFunctionLibrary.fetchJoinableSpaces(spaceConnection);
			console.log(spaces);

			return spaces;
		}
		catch (err)
		{
			throw err;
		}
	}

	public bindJoinableSpaces(spaceConnection: CavrnusSpaceConnection, spaceAdded: (s: CavrnusSpace) => void, spaceUpdated: (s: CavrnusSpace) => void, spaceRemoved: (s: CavrnusSpace) => void): Hook
	{
		try
		{
			return this.cavrnusFunctionLibrary.bindJoinableSpaces(spaceConnection, spaceAdded, spaceUpdated, spaceRemoved);
		}
		catch (err)
		{
			console.log("error binding!", err)
			throw err;
		}
	}

	// public async fetchJoinableSpacesAsync(spaceConnection: CavrnusSpaceConnection): Promise<CavrnusSpace[]>
	// {
	// 	try
	// 	{
	// 		const spaces = await this.cavrnusFunctionLibrary.fetchJoinableSpacesAsync(spaceConnection, );
	// 		console.log(spaces);

	// 		return spaces;
	// 	}
	// 	catch (err)
	// 	{
	// 		throw err;
	// 	}
	// }

	public isConnectedToAnySpace(spaceConnection: CavrnusSpaceConnection): boolean
	{
		try
		{
			return this.cavrnusFunctionLibrary.isConnectedToAnySpace(spaceConnection);
		}
		catch (err)
		{
			throw err;
		}
	}

	public isLoggedIn(): boolean
	{
		try
		{
			return this.cavrnusFunctionLibrary.isLoggedIn();
		}
		catch (err)
		{
			throw err;
		}
	}

	public exitSpace(): void
	{
		try
		{
			return this.exitSpace();
		}
		catch (err)
		{
			throw err;
		}
	}

	//#region String

	public async stringPropertyHasDefaultValue(spaceConnection: CavrnusSpaceConnection, container: string, id: string)
	{
		try
		{
			this.cavrnusFunctionLibrary.stringPropertyHasDefaultValue(spaceConnection, container, id);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public async postStringPropertyUpdate(spaceConnection: CavrnusSpaceConnection, container: string, id: string, value: string)
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			this.cavrnusFunctionLibrary.postStringPropertyUpdate(spaceConnection, container, id, value);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public getStringPropertyValue(spaceConnection: CavrnusSpaceConnection, containerName: string, propertyName: string): string | undefined
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.getStringPropertyValue(spaceConnection, containerName, propertyName);

		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindStringProperty(spaceConnection: CavrnusSpaceConnection, containerId: string, propertyId: string, callback: (v: string) => void): Hook
	{
		if (!this.cavrnusFunctionLibrary)
			throw new Error("Room system not found");

		return this.cavrnusFunctionLibrary.bindStringPropertyValue(spaceConnection, containerId, propertyId, callback);
	}

	//#region Color

	public async postColorPropertyUpdate(spaceConnection: CavrnusSpaceConnection, container: string, id: string, value: RgbaColor)
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			this.cavrnusFunctionLibrary.postColorPropertyUpdate(spaceConnection, container, id, value);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public getColorPropertyValue(spaceConnection: CavrnusSpaceConnection, containerName: string, propertyName: string): RgbaColor | undefined
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.getColorPropertyValue(spaceConnection, containerName, propertyName);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindColorProperty(spaceConnection: CavrnusSpaceConnection, containerId: string, propertyId: string, callback: (v: RgbaColor) => void): Hook
	{
		if (!this.cavrnusFunctionLibrary)
			throw new Error("Room system not found");

		return this.cavrnusFunctionLibrary.bindColorPropertyValue(spaceConnection, containerId, propertyId, callback);
	}
	
	//#region Boolean

	public async postBooleanPropertyUpdate(spaceConnection: CavrnusSpaceConnection, container: string, propertyId: string, value: boolean)
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			this.cavrnusFunctionLibrary.postBooleanPropertyUpdate(spaceConnection, container, propertyId, value);
		}
		catch (err)
		{
			throw err;
		}
	}

	public bindBooleanProperty(spaceConnection: CavrnusSpaceConnection, containerId: string, propertyId: string, callback: (v: boolean) => void): Hook
	{
		if (!this.cavrnusFunctionLibrary)
			throw new Error("Room system not found");

		return this.cavrnusFunctionLibrary.bindBooleanPropertyValue(spaceConnection, containerId, propertyId, callback);
	}

	//#region Scalar

	public bindScalarProperty(spaceConnection: CavrnusSpaceConnection, containerId: string, propertyId: string, callback: (v: number) => void): Hook
	{
		if (!this.cavrnusFunctionLibrary)
			throw new Error("Room system not found");

		return this.cavrnusFunctionLibrary.bindScalarPropertyValue(spaceConnection, containerId, propertyId, callback);
	}

	public async postScalarPropertyUpdate(spaceConnection: CavrnusSpaceConnection, container: string, propertyId: string, value: number)
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			this.cavrnusFunctionLibrary.postScalarPropertyUpdate(spaceConnection, container, propertyId, value);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	//#region Space users

	public bindSpaceUsers(spaceConnection: CavrnusSpaceConnection, userAdded: (v: CavrnusUser) => void, userRemoved: (v: CavrnusUser) => void): Hook
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.bindSpaceUsers(spaceConnection, userAdded, userRemoved);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public getSpaceUsers(spaceConnection: CavrnusSpaceConnection): CavrnusUser[]
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.getCurrentSpaceUsers(spaceConnection);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindUserSpeaking(spaceConnection: CavrnusSpaceConnection, user: CavrnusUser, callback: (v: boolean) => void): Hook
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.bindUserSpeaking(spaceConnection, user, callback);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindUserStreaming(spaceConnection: CavrnusSpaceConnection, user: CavrnusUser, callback: (v: boolean) => void): Hook
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.bindUserStreaming(spaceConnection, user, callback);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindUserName(spaceConnection: CavrnusSpaceConnection, user: CavrnusUser, callback: (v: string) => void): Hook
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.bindUserName(spaceConnection, user, callback);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public getUserName(spaceConnection: CavrnusSpaceConnection, user: CavrnusUser): string
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.getUserName(spaceConnection, user);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindProfilePic(spaceConnection: CavrnusSpaceConnection, user: CavrnusUser, callback: (v: string) => void): Hook
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.bindProfilePic(spaceConnection, user, callback);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindUserMuted(spaceConnection: CavrnusSpaceConnection, user: CavrnusUser, callback: (v: boolean) => void): Hook
	{
		try
		{
			if (!this.cavrnusFunctionLibrary)
				throw new Error("Room system not found");

			return this.cavrnusFunctionLibrary.bindUserMuted(spaceConnection, user, callback);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}
}