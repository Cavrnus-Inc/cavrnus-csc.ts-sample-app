<template>
	<v-card class="position-relative participant-card overflow-hidden">
		<div class="position-relative h-100">
			<v-img v-if="isVideoMuted && isPresentationMuted"
				class="video-container"
				aspect-ratio="1.33"
				:src="resolvePictureUrl(profilePicture)"
				cover
			></v-img>
		
			<video v-else-if="!isVideoMuted"
				:srcObject="videoStream"
				autoplay="autoplay"
				playsinline="playsinline"
				webkit-playsinline="webkit-playsinline"
				class="video-container"
			></video>
		
			<video v-else-if="!isPresentationMuted"
				:srcObject="presentationStream"
				autoplay="autoplay"
				playsinline="playsinline"
				webkit-playsinline="webkit-playsinline"
				class="video-container"
			></video>

			<div class="overlay-container">
				<v-toolbar density="compact" color="rgba(0, 0, 0, 0.5)" flat class="px-2">
					<div class="participant-name text-white">
						{{ userProfileDisplayName(props.user) }}
					</div>
				</v-toolbar>

				<div class="control-overlay pa-2 bg-black bg-opacity-50">
					<div class="d-flex justify-center align-center">
						<v-btn
							icon
							size="small"
							:disabled="!isSelf && isAudioMuted"
							:color="isAudioMuted ? 'error' : 'white'"
							class="mx-1"
							@click="onUserMuteStateUpdated(!isAudioMuted)"
						>
							<v-icon icon="mdi-microphone-off" v-if="isAudioMuted"></v-icon>
							<v-icon icon="mdi-microphone" v-else></v-icon>
						</v-btn>

						<v-btn
							icon
							size="small"
							:disabled="!isSelf"
							:color="isVideoMuted ? 'error' : 'white'"
							class="mx-1"
							@click="isVideoMuted ? startVideo() : stopVideo()"
						>
							<v-icon icon="mdi-video-off" v-if="isVideoMuted"></v-icon>
							<v-icon icon="mdi-video" v-else></v-icon>
						</v-btn>

						<v-btn
							icon
							size="small"
							:disabled="!isSelf"
							:color="isPresentationMuted ? 'error' : 'white'"
							class="mx-1"
							@click="isPresentationMuted ? startScreenShare() : stopScreenShare()"
						>
							<v-icon icon="mdi-monitor-off" v-if="isPresentationMuted"></v-icon>
							<v-icon icon="mdi-monitor-share" v-else></v-icon>
						</v-btn>
					</div>
				</div>
			</div>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useAppState, useConn } from '../state';
import { Hook } from '@cavrnus/lib/V';
import { CavrnusUser } from '@cavrnus/csc';

const props = defineProps<{ 
	user: CavrnusUser
}>();

const state = useAppState();
const conn = useConn();
const isLoading = ref(true);
let spaceConnection = conn.get();

const profilePicture = ref("");
const username = ref("");
const localConnectionId = ref("");
const isAudioMuted = ref(false);
const isVideoMuted = ref(true);
const isPresentationMuted = ref(true);
const videoStream = ref<MediaStream>();
const presentationStream = ref<MediaStream>();
const isSelf = ref(false);

const hooks = ref<Hook[]>([]);

onBeforeMount(async () => 
{
	await hookProperties();
	isLoading.value = false;
});

async function hookProperties()
{
	try
	{
		if (spaceConnection && spaceConnection.session && state.csc)
		{
			if (props.user.isLocalUser)
			{
				const localUser = await spaceConnection.session.awaitLocalUser();
				localConnectionId.value = localUser.connectionId;
				isSelf.value = true;
			}

			state.csc.setLocalUserStreamingState(spaceConnection, false, false); // This allows remote connection

			hooks.value.push(state.csc.bindUserName(spaceConnection, props.user, v => {username.value = v}));
			hooks.value.push(state.csc.bindProfilePic(spaceConnection, props.user, v => {profilePicture.value = v}));

			if (isSelf.value)
			{
				hooks.value.push(state.csc.bindLocalUserPresentationStream(v => { presentationStream.value = v }));
				hooks.value.push(state.csc.bindLocalUserVideoStream(v => { videoStream.value = v }));
				hooks.value.push(state.csc.bindLocalUserVideoMuteState(v => { isVideoMuted.value = v }));
				hooks.value.push(state.csc.bindLocalUserPresentationMuteState(v => { isPresentationMuted.value = v }));
				hooks.value.push(state.csc.bindLocalUserMuteState(v => { isAudioMuted.value = v }));
			}
			else
			{
				hooks.value.push(state.csc.bindRemoteUserVideoStream(spaceConnection, props.user, v => { videoStream.value = v }));
				hooks.value.push(state.csc.bindRemoteUserStreamActive(spaceConnection, props.user, v => { isVideoMuted.value = !v }));
				hooks.value.push(state.csc.bindUserMuted(spaceConnection, props.user, v => { isAudioMuted.value = v }));
			}
		}
	}
	catch (err)
	{
		console.log(err);
		throw err;
	}
}

async function startScreenShare()
{
	try
	{
		if (state.csc && spaceConnection)
			await state.csc.startPresentation(spaceConnection);

	} catch (error) {
		console.error('Screen sharing cancelled or failed');
	}
}

async function stopScreenShare()
{
	try 
	{
		if (state.csc && spaceConnection)
			await state.csc.stopPresentation(spaceConnection)
	} 
	catch (error) {
		console.error('Screen sharing cancelled or failed');
	}
}

async function startVideo()
{
	try
	{
		if (state.csc && spaceConnection)
			await state.csc.startVideo(spaceConnection);

	} catch (error) {
		console.error('Screen sharing cancelled or failed');
	}
}

async function stopVideo()
{
	try 
	{
		if (state.csc && spaceConnection)
			await state.csc.stopVideo(spaceConnection)
	} 
	catch (error) {
		console.log('Screen sharing cancelled or failed');
	}
}

function onUserMuteStateUpdated(value: boolean | null)
{
	if (state.csc && spaceConnection && value !== null)
	{
		if (isSelf.value)
		{
			state.csc.setLocalUserMutedState(value);
		}
		else if (!isAudioMuted.value)
			state.csc.requestRemoteUserMute(spaceConnection, props.user.connectionId);
	}
}

function resolvePictureUrl(profilePicture: string | undefined)
{

	const pictureUrl = profilePicture;
	if (pictureUrl?.startsWith("/"))
		return (pictureUrl).replace("/api/api", "/api");

	return pictureUrl;
}

function userProfileDisplayName(user: CavrnusUser)
{
	if (user.userProfile?.firstName && user.userProfile.lastName)
		return `${user.userProfile.firstName} ${user.userProfile.lastName}`;
	else if (user.userProfile?.screenName)
		return username.value;
	else
		return "";
}

onBeforeUnmount(() => {
	try
	{
		hooks.value.forEach(h => h.off());
		hooks.value = [];
	}
	catch (err)
	{
		console.error(err);
		throw err;
	}
});
</script>

<style scoped>
.participant {
	max-height: 192px !important;
	min-height: 96px !important;
	width: 175px !important;
}

.participant-name
{
	font-weight: 400;
	font-size: 16px;
}

.video-container
{
	height: 180px !important;
	max-width: unset !important;
	padding: 0 !important;
	position: relative;
	width: 100%;
}

.icon 
{
	z-index: 1;
	color: black;
	height: 10px;
	width: 10px;
}

.control-overlay 
{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transition: opacity 0.2s;
}

.participant-card
{
	width: 100%;
}

.participant-card:hover .control-overlay 
{
  opacity: 1;
}

.participant-card .control-overlay 
{
  opacity: 0;
}
</style>