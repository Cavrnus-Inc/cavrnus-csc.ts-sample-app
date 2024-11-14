<template>
	<v-layout>
		<Header></Header>

		<v-main class="container">
			<div class="d-flex fill-height" v-if="isLoading">
				<div class="d-flex align-top justify-center">
					<v-progress-circular indeterminate></v-progress-circular>
				</div>
			</div>

			<div v-else>
				<v-row no-gutters>
					<v-col cols="7">
						<Properties />
					</v-col>
					<v-col cols="3"></v-col>
					<v-col cols="2">
						<Participants/>
					</v-col>
				</v-row>
			</div>
		</v-main>
	</v-layout>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { useAppState, useConn } from "../state";
import { useRouter } from "vue-router";
import Properties from "./Properties.vue";
import Participants from "./Participants.vue";
import Header from "./Header.vue";

const state = useAppState();
const conn = useConn();
const router = useRouter();
const isLoggedIn = ref(false);
const isLoading = ref(true);
let spaceConnection = conn.get();
const roomName = ref("");

onBeforeMount(async () => {
	if (state.csc && conn.get() && spaceConnection)
	{
		isLoggedIn.value = state.csc.isLoggedIn();

		if (spaceConnection.session && spaceConnection.session.roomMetadata.get())
			roomName.value = spaceConnection.session.roomMetadata.get().name;
	}
	else
	{
		router.push({ name: "signin" });
	}

	isLoading.value = false;
});

function stop()
{
	if (state.csc && spaceConnection) {
		state.csc.exitSpace(spaceConnection);
	}
}

onBeforeUnmount(() => {
	try
	{
		stop();
	}
	catch (err)
	{
		console.error(err);
		throw err;
	}
});

watch(isLoggedIn, () => {
	if (!isLoggedIn.value)
		router.push({ name: "signin" });
});

</script>

<style scoped>
.card {
	width: 720px;
}

.container {
	padding-left: 20px;
	padding-right: 20px;
}
</style>