import { CavrnusSpaceConnection, Hook } from "@cavrnus/csc";

export class SpaceConnectionManager
{
	_spaceConnection = new CavrnusSpaceConnection();

	// TODO fix this type
	public async connect(session: any): Promise<void>
	{
		try
		{
			this._spaceConnection.connect(session);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public async postStringPropertyUpdate(container: string, id: string, value: string)
	{
		try
		{
			if (!this._spaceConnection)
				throw "No room system found";

			this._spaceConnection.postStringPropertyUpdate(container, id, value);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public getStringPropertyValue(containerName: string, propertyName: string): string | undefined
	{
		try
		{
			if (!this._spaceConnection)
				throw "No room system found";

			return this._spaceConnection.getStringPropertyValue(containerName, propertyName);

		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindStringProperty(containerId: string, propertyId: string, callback: (v: string) => void): Hook
	{
		if (!this._spaceConnection)
			throw "No room system found";

		return this._spaceConnection.bindStringPropertyValue(containerId, propertyId, callback);
	}
	
	public async postBooleanPropertyUpdate(container: string, propertyId: string, value: boolean)
	{
		try
		{
			if (!this._spaceConnection)
				throw "No room system found";

			this._spaceConnection.postBooleanPropertyUpdate(container, propertyId, value);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public async postScalarPropertyUpdate(container: string, propertyId: string, value: number)
	{
		try
		{
			if (!this._spaceConnection)
				throw "No room system found";

			this._spaceConnection.postScalarPropertyUpdate(container, propertyId, value)
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public get spaceConnection()
	{
		return this._spaceConnection;
	}
}