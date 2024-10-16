import { CavrnusSpaceConnection } from "@cavrnus/csc";

export class Conn
{
	private spaceConnection!: CavrnusSpaceConnection;

	public set(spaceConnection: CavrnusSpaceConnection)
	{
		this.spaceConnection = spaceConnection;
	}

	public get()
	{
		return this.spaceConnection;
	}
}