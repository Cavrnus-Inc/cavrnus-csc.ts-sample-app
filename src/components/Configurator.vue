<template>
    <div class="d-flex align-center justify-center fill-height">
		<v-main class="d-flex align-top justify-center" v-if="isLoading">
			<div>
				<v-progress-circular indeterminate></v-progress-circular>
			</div>
		</v-main>

		<v-card class="card" v-if="!isLoading">
			<v-tabs v-model="tab">
				<v-tab value="participants">Participants</v-tab>
				<v-tab value="properties">Properties</v-tab>
			</v-tabs>
			<v-tabs-window v-model="tab">
				<v-tabs-window-item value="properties">
					<v-card-text>
						<Properties/>
					</v-card-text>
				</v-tabs-window-item>
				<v-tabs-window-item value="participants">
					<v-card-text>
						<Participants/>
					</v-card-text>
				</v-tabs-window-item>
			</v-tabs-window>
		</v-card>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { useAppState, useConn } from "../state";
import { useRouter } from "vue-router";
import Properties from "./Properties.vue";
import Participants from "./Participants.vue";

const state = useAppState();
const conn = useConn();
const router = useRouter();
const isLoggedIn = ref(false);
const isLoading = ref(true);
const tab = ref("participants");

onBeforeMount(async () => {
	if (state.csc && conn.get())
	{
		isLoggedIn.value = state.csc.isLoggedIn();
	}
	else
	{
		router.push({name: "signin"});
	}

	isLoading.value = false;
});

function stop()
{
	if (state.csc!)
	{
		state.csc!.exitSpace();
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
		router.push({name: "signin"});
});

</script>

<style scoped>
.card {
	width: 720px;
}
</style>../services/csc