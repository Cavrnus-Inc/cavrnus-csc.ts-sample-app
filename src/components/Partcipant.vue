<template>
	<v-card class="d-flex align-center pt-3 participant-card">
		<v-card-text>
			<v-row>
				<div class="participant-name">{{ userProfileDisplayName(props.user) }}</div>
			</v-row>
			<v-row>
				<v-img v-if="isVideoMuted && isPresentationMuted" class="video-container" :src="resolvePictureUrl(profilePicture)"></v-img>
				<video :srcObject="videoStream" v-else-if="!isVideoMuted" autoplay="autoplay" playsinline="playsinline" webkit-playsinline="webkit-playsinline" class="video-container">
				</video>
				<video :srcObject="presentationStream" v-else-if="!isPresentationMuted" autoplay="autoplay" playsinline="playsinline" webkit-playsinline="webkit-playsinline" class="video-container">
				</video>
			</v-row>
			<v-row class="mt-4">
				<v-col cols="6">
					<v-btn variant="flat" class="btn" v-if="!isAudioMuted" @click="onUserMuteStateUpdated(true)">Mute Audio</v-btn>
					<v-btn variant="flat" class="btn" :disabled="!isSelf && isAudioMuted" v-else-if="isAudioMuted" @click="onUserMuteStateUpdated(false)">Unmute Audio</v-btn>
				</v-col>
				<v-col cols="6">
					<v-btn variant="flat" class="btn" :disabled="!isSelf" v-if="!isVideoMuted" @click="stopVideo">Mute Video</v-btn>
					<v-btn variant="flat" class="btn" :disabled="!isSelf" v-else-if="isVideoMuted" @click="startVideo">Unmute Video</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="6">
					<v-btn variant="flat" class="btn" :disabled="!isSelf" v-if="!isPresentationMuted" @click="stopScreenShare">Stop Sharing Screen</v-btn>
					<v-btn variant="flat" class="btn" :disabled="!isSelf" v-else-if="isPresentationMuted" @click="startScreenShare">Share Screen</v-btn>
				</v-col>
			</v-row>
		</v-card-text>
</v-card>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
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
const isVideoLoading = ref(false);
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
	width: 175px;
}

.participant-name
{
	font-weight: 400;
	font-size: 16px;
}

.video-container
{
	display: table-row;
	height: 96px !important;
	max-width: unset !important;
	padding: 0 !important;
	position: relative;
	width: 100%;
}

.btn {
	color: gray;
	text-transform: none;
}
</style>