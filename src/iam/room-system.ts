import { Conn, RoomSystem } from "@cavrnus/lib";

export class RoomSystemManager
{

	private _roomSystem?: RoomSystem.RoomSystem;

	private connectRoomSystem(session: Conn.SessionConnection): void
	{
		try
		{
			// Create room system
			this._roomSystem = RoomSystem.createRoomSystemForConnection(session, {processObjects: true});
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}
        
	public async connect(session: Conn.SessionConnection): Promise<void>
	{
		try
		{
			this.connectRoomSystem(session);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public async updateString(value: string, id: string)
	{
		try
		{
			if (!this._roomSystem)
				throw "No room system found";

			this._roomSystem.conn?.sendOp({
				updatePropertyValue: {
					v1: {
						propId: {
							id: id
						},
						string: {
							assignmentId: "-",
							priority: 0,
							value: {
								constant: value
							}
						}
					}
				}
			});

			console.log(`${id} has been updated!`);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}
	
	public async updateBoolean(updatedValue: boolean, id: string)
	{
		try
		{
			if (!this._roomSystem)
				throw "No room system found";

			this._roomSystem.conn?.sendOp({
				updatePropertyValue: {
					v1: {
						propId: {
							id: id
						},
						boolean: {
							assignmentId: "-",
							priority: 0,
							value: {
								constant: updatedValue
							}
						}
					}
				}
			});

			console.log(`${id} has been updated!`);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}

	public async updateScalar(updatedValue: number, id: string)
	{
		try
		{
			if (!this._roomSystem)
				throw "No room system found";

			this._roomSystem.conn?.sendOp({
				updatePropertyValue: {
					v1: {
						propId: {
							id: id
						},
						scalar: {
							assignmentId: "-",
							value: {
								constant: updatedValue
							}
						}
					}
				}
			});

			console.log(`${id} has been updated!`);
		}
		catch (err)
		{
			console.error(err);
			throw err;
		}
	}
}