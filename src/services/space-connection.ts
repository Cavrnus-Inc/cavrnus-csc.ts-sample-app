import { CavrnusSpaceConnection, Hook, RgbaColor } from "@cavrnus/csc";



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

	//#region String

	public async stringPropertyHasDefaultValue(container: string, id: string)
	{
		this._spaceConnection.stringPropertyHasDefaultValue(container, id);
	}

	public async postStringPropertyUpdate(container: string, id: string, value: string)
	{
		try
		{
			if (!this._spaceConnection)
				throw new Error("Room system not found");

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
				throw new Error("Room system not found");

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
			throw new Error("Room system not found");

		return this._spaceConnection.bindStringPropertyValue(containerId, propertyId, callback);
	}

	//#region Color

	public async postColorPropertyUpdate(container: string, id: string, value: RgbaColor)
	{
		try
		{
			if (!this._spaceConnection)
				throw new Error("Room system not found");

			this._spaceConnection.postColorPropertyUpdate(container, id, value);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public getColorPropertyValue(containerName: string, propertyName: string): RgbaColor | undefined
	{
		try
		{
			if (!this._spaceConnection)
				throw new Error("Room system not found");

			return this._spaceConnection.getColorPropertyValue(containerName, propertyName);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public bindColorProperty(containerId: string, propertyId: string, callback: (v: RgbaColor) => void): Hook
	{
		if (!this._spaceConnection)
			throw new Error("Room system not found");

		return this._spaceConnection.bindColorPropertyValue(containerId, propertyId, callback);
	}
	
	//#region Boolean

	public async postBooleanPropertyUpdate(container: string, propertyId: string, value: boolean)
	{
		try
		{
			if (!this._spaceConnection)
				throw new Error("Room system not found");

			this._spaceConnection.postBooleanPropertyUpdate(container, propertyId, value);
		}
		catch (err)
		{
			throw err;
		}
	}

	public bindBooleanProperty(containerId: string, propertyId: string, callback: (v: boolean) => void): Hook
	{
		if (!this._spaceConnection)
			throw new Error("Room system not found");

		return this._spaceConnection.bindBooleanPropertyValue(containerId, propertyId, callback);
	}

	//#region Scalar

	public bindScalarProperty(containerId: string, propertyId: string, callback: (v: number) => void): Hook
	{
		if (!this._spaceConnection)
			throw new Error("Room system not found");

		return this._spaceConnection.bindScalarPropertyValue(containerId, propertyId, callback);
	}

	public async postScalarPropertyUpdate(container: string, propertyId: string, value: number)
	{
		try
		{
			if (!this._spaceConnection)
				throw new Error("Room system not found");

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