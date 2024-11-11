import { CavrnusSpaceConnection } from "@cavrnus/csc";

export class Conn
{
	private spaceConnection: CavrnusSpaceConnection | undefined;

	public set(spaceConnection: CavrnusSpaceConnection | undefined)
	{
		this.spaceConnection = spaceConnection;
	}

	public get()
	{
		return this.spaceConnection;
	}
}