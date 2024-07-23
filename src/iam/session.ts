import { Conn, Api } from "@cavrnus/lib";
import * as config from "../../configs/app.config.json";
import { LoginRequest } from "@cavrnus/lib/api";
import { ConnectionStatus } from "./connection-status";

export class SessionManager
{
	private _status = ConnectionStatus.Disconnected;
	private _session?: Conn.SessionConnection;

    private async authenticate(roomId: string): Promise<void>
    {
		try
		{
			// Configure api
			const api = Api.CavrnusApi.fromUrl(config.apiEndpoint);
			console.info("Fetched API for domain");
	
			const req: LoginRequest = {
				email: config.email,
				password: config.password
			};

			const authenticatedApi = await Api.loginUser(api, req);
			console.info("Successfully authenticated with Cavrnus API");
	
			// Connect session
			this._session = await Conn.connectSession(authenticatedApi, roomId, {clientId: "web-car-configurator"});
			this._session.onDisconnected.one(() => this.disconnect());
		}
		catch (err)
		{
			throw err;
		}
    }
    
	public async start(roomId: string): Promise<void>
	{
		try
		{
			console.info("Starting session...");

			this._status = ConnectionStatus.Connecting;

			await this.authenticate(roomId);

			this._status = ConnectionStatus.Connected;

			console.info(`Session is ${this._status}`);
		}
		catch (err)
		{
			throw err;
		}
	}

	private async disconnect()
	{
		if (this._session)
		{
			this._status = ConnectionStatus.Disconnecting;

			try
			{
				this._session.disconnect();
				setTimeout(() => {}, 1000);

			}
			catch (err)
			{
				console.error("Error disconnecting from space: \n", err);
			}

			this._session = undefined;
		}

		this._status = ConnectionStatus.Disconnected;
	}

	public get isConnected()
	{
		return this._status === ConnectionStatus.Connected;
	}

	public get session(): Conn.SessionConnection | undefined
	{
		return this._session;
	}

	public async stop()
	{
		await this.disconnect();
		console.info("Disconnected from space");
	}
}