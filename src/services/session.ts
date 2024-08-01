import { CavrnusSession } from "@cavrnus/csc";

export class Session
{
	_session = new CavrnusSession();

	public async authenticateWithPassword(apiEndpoint: string, email: string, password: string): Promise<void>
	{
		try
		{
			if (!this._session)
				return;
			
			await this._session.authenticateWithPassword(apiEndpoint, email, password);
		}
		catch (err)
		{
			throw err;
		}
	}

	public async joinSpace(roomId: string, clientId?: string): Promise<void>
	{
		try
		{
			if (!this._session)
				return;

			await this._session.joinSpace(roomId, clientId ? clientId : "sample-app");
		}
		catch (err)
		{
			throw err;
		}
	}

	public get session(): CavrnusSession
	{
		return this._session;
	}

	public get isConnected(): boolean
	{
		if (!this._session)
			return false;

		return this._session.isConnected;
	}
}