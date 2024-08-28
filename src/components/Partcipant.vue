<template>
	<v-card class="d-flex align-center">
		<v-img cover height="39" width="39" :src="resolvePictureUrl(profilePicture)"></v-img>
		<v-card-text>
			<b>{{ userProfileDisplayName(user) }}</b>
		</v-card-text>
</v-card>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAppState, useConn } from '../state';
import { Hook } from '@cavrnus/lib/V';
import { CavrnusSpace, CavrnusUser } from '@cavrnus/csc/types';

const props = defineProps<{ 
	user: CavrnusUser
}>();

const state = useAppState();
const conn = useConn();
const isLoading = ref(true);
let spaceConnection = conn.get();

const profilePicture = ref("");
const username = ref("");
const spaces: CavrnusSpace[] = []

const hooks = ref<Hook[]>([]);

onBeforeMount(async () => {
	await hookProperties();

	isLoading.value = false;
});

async function hookProperties()
{
	try
	{
		if (spaceConnection && state.csc)
		{
			hooks.value.push(state.csc!.bindUserName(spaceConnection, props.user, v => {username.value = v}));
			hooks.value.push(state.csc!.bindProfilePic(spaceConnection, props.user, v => {profilePicture.value = v}));
		}
	}
	catch (err)
	{
		console.log(err);
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