import { CavrnusSpaceConnection } from "@cavrnus/csc";
import { LiveSwitchService } from "@cavrnus/webrtc";

export default class WebRtc
{
	private service!: LiveSwitchService;

	public async start(sessionConnection: CavrnusSpaceConnection)
	{
		const liveswitchService = new LiveSwitchService();
		await liveswitchService.start(sessionConnection.session!);
	}
}