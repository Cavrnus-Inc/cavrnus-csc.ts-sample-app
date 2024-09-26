<template>
    <div class="fill-height">
		<v-main class="d-flex align-top justify-center" v-if="isLoading">
			<div>
				<v-progress-circular indeterminate></v-progress-circular>
			</div>
		</v-main>
		<div v-if="!isLoading">
			<div>
				<v-row align="center">
					<v-col>
						Audio
					</v-col>
					<v-col cols="8">
						<v-select :items="audioDevices" item-value="id" item-title="name"></v-select>
					</v-col>
				</v-row>
				<v-row align="center">
					<v-col>
						Video
					</v-col>
					<v-col cols="8">
						<v-select :items="videoDevices" item-value="id" item-title="name"></v-select>
					</v-col>
				</v-row>
			</div>
			<div class="d-flex align-center fill-height">
				<v-row row wrap>
					<v-col class="mb-4" cols="6" v-for="user of spaceUsers">
						<Partcipant class="mr-4" :user="user" />
					</v-col>
				</v-row>
			</div>
		</div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useAppState, useConn } from '../state';
import { CavrnusUser, Hook } from '@cavrnus/csc';
import Partcipant from './Partcipant.vue';
import { CavrnusWebRtc, InputDevice } from '@cavrnus/webrtc';

const state = useAppState();
const conn = useConn();
const isLoading = ref(true);
const spaceConnection = conn.get();

const hooks = ref<Hook[]>([]);
const audioDevices = ref<InputDevice[]>([]);
const videoDevices = ref<InputDevice[]>([]);

const spaceUsers = ref<CavrnusUser[]>([]);

onBeforeMount(async () => {
	await hookProperties();
	await connectRtc();

	isLoading.value = false;
});

function onLocalAudioLevelChanged(level: number)
{

}

function onLocalMuteChanged(value: boolean)
{
	console.log("we're muted")
}

async function hookProperties()
{
	try
	{
		if (spaceConnection && state.csc)
		{
			hooks.value.push(state.csc!.bindSpaceUsers(spaceConnection, v => {spaceUsers.value.push(v);}, v => {spaceUsers.value.splice(spaceUsers.value.indexOf(v), 1);}));
		}
	}
	catch (err)
	{
		console.log(err);
	}
}

async function connectRtc()
{
	try
	{
		const webRtc = await CavrnusWebRtc.startWebRtc(spaceConnection.session!);
		// create connector
		// give connector and session to next thing
		audioDevices.value = webRtc.audioDevices;
		videoDevices.value = webRtc.videoInputs;
	}
	catch (err)
	{
		console.log(err);
	}
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