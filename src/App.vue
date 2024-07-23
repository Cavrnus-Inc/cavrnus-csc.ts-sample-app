<template>
	<v-app class="background">
		<router-view/>
	</v-app>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAppState } from './state/app';
import { useRouter } from 'vue-router';

const state = useAppState();
const router = useRouter();

const connected = ref(state.session?.isConnected ?? false);

onMounted(() => {
	if (!state.session?.isConnected)
		router.push({name: "signin"});
});

watch(connected, () => {
	router.push({name: "signin"});
})
</script>

<style scoped>
.background {
	background-color: #D3D4D8 !important;
}
</style>
