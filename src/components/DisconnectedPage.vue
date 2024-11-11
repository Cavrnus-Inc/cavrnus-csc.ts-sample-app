<template>
	<v-card class="d-flex align-center justify-center fill-height">
		<div class="d-block">
			<v-alert variant="outlined" type="error" prominent border="top" title="Error">
				<v-row no-gutters>
					Space connection has timed out.				
				</v-row>
			</v-alert>
			<v-btn block class="mt-2" @click="routeToSignin">
				Back to Sign-In Page
			</v-btn>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function routeToSignin()
{
	router.push({ name: "signin" });
}

</script>

<style scoped></style>
