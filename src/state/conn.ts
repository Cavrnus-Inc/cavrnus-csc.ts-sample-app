import { SpaceConnection } from "@cavrnus/csc";

export class Conn
{
	private spaceConnection!: SpaceConnection;

	public set(spaceConnection: SpaceConnection)
	{
		this.spaceConnection = spaceConnection;
	}

	public get()
	{
		return this.spaceConnection;
	}
}