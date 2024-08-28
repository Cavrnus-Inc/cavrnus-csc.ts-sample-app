<template>
	<v-app class="background">
		<router-view/>
	</v-app>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAppState, useConn } from './state';
import { useRouter } from 'vue-router';

const state = useAppState();
const router = useRouter();
const conn = useConn();

const connected = ref(conn.get() ?? false);

onMounted(() => {
	if (!connected.value)
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
