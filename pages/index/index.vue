<template>
	<view class="main-container">
		<view class="column">
			<view class="title-container">
				<text class="title-text-24">Login/Sign</text>
			</view>

			<view class="input-container input-text">
				<text style="flex: .25; font-size: 4.26vw;">Email</text>
				<form style="width: 100%;  flex: 1;">
					<input style="font-size: 5.3vw;" />
				</form>
			</view>

			<StyledButton width="100%" height="fit-content" backgroundColor="#161616" padding="1vh 6.4vw"
				borderRadius="2.4em" style="margin-bottom: 3.75vh">
				<text class="next-button-text-20">Sent</text>
			</StyledButton>
			<div class="OR-segment-container">
				<hr class="segment-line">
				<span class="segment-or-text">OR</span>
				<hr class="segment-line">
			</div>
			<ThirdPartyButton buttonType="google" />
			<ThirdPartyButton buttonType="facebook" />
		</view>
	</view>
</template>

<script>
	import StyledButton from "../../components/StyledButton.vue"
	import ThirdPartyButton from "../../components/ThirdPartyButton.vue"

	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		components: {
			StyledButton,
			ThirdPartyButton
		},
		methods: {

		}
	}
</script>

<style>
	.column {
		display: flex;
		flex-direction: column;
	}

	.input-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 4.76vh;
		border-bottom: 1px solid rgba(0, 0, 0, 0.3);
		padding: 0em 0.8em 0.4em 0.8em;
	}

	.input-text {
		font-family: Avenir;
		color: black;
		font-weight: 800;
	}

	.title-container {
		margin: 3.61vh 2.13vw 8.09vh 2.13vw
	}

	.OR-segment-container {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2.45vh;
	}

	.segment-line {
		flex: 1;
		border: 1px solid rgba(207, 219, 213, 0.6)
	}

	.segment-or-text {
		padding: 0 3.1vw;
		white-space: nowrap;
		font-family: Avenvir;
		font-weight: 400;
		font-size: 1.2em;
		color: #5D5D5B;
	}
</style>