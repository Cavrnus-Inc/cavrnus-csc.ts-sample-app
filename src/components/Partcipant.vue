<template>
	<v-card class="d-flex align-center">
		<v-img cover size="96" :src="resolvePictureUrl(profilePicture)"></v-img>
		<v-card-text>
			<v-row>
				<b>{{ userProfileDisplayName(props.user) }}</b>
			</v-row>
			<v-row>
				<span>Remote muted: {{ isAudioMuted }}</span>
			</v-row>
			<v-row>
				<v-switch v-model="isAudioMuted" @update:model-value="onUserMuteStateUpdated"></v-switch>
			</v-row>
			<v-row v-if="isSelf">
				<span>Video muted: {{ isVideoMuted }}</span>
			</v-row>
			<v-row v-if="isSelf">
				<v-switch v-model="isVideoMuted" @update:model-value="onUserStreamStateUpdated"></v-switch>
			</v-row>
			<v-row v-if="isVideoMuted">

			</v-row>
		</v-card-text>
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
const isAudioMuted = ref(false);
const isVideoMuted = ref(false);
const isSelf = ref(false);

const hooks = ref<Hook[]>([]);

onBeforeMount(async () => {
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
				isSelf.value = true;

			hooks.value.push(state.csc!.bindUserName(spaceConnection, props.user, v => {username.value = v}));
			hooks.value.push(state.csc!.bindProfilePic(spaceConnection, props.user, v => {profilePicture.value = v}));
			hooks.value.push(state.csc!.bindUserMuted(spaceConnection, props.user, v => { isAudioMuted.value = v }));
			hooks.value.push(state.csc!.bindUserStreaming(spaceConnection, props.user, v => { isVideoMuted.value = v }));
		}
	}
	catch (err)
	{
		console.log(err);
		throw err;
	}
}

function getVideoStream()
{
	// return state.csc?.liveswitchService?.localMedia.
}

function onUserMuteStateUpdated(value: boolean | null)
{
	if (state.csc && value !== null)
	{
		if (isSelf.value)
			state.csc.setLocalUserMutedState(value);
		else
			state.csc.requestRemoteUserMute(spaceConnection, props.user.connectionId);
	}
}

function onUserStreamStateUpdated(value: boolean | null)
{
	if (state.csc && value !== null)
	{
		console.log("we're updating streaming state")
		state.csc.setLocalUserStreamingState(spaceConnection, value, value);
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
.card {
	padding: 10px;
	width: 720px;
}
</style>