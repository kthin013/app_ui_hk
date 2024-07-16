<template>
	<view class="main-container">
		<view class="column">
			<view class="title-container">
				<text class="title-text-24">Login/Sign</text>
			</view>
			<wd-input type="text" v-model="value" style="margin-bottom: 4.76vh;" />
			<StyledButton width="100%" height="content-fit" backgroundColor="#161616" padding="2.02vh 6.4vw"
				borderRadius="2.4em" style="margin-bottom: 3.75vh">
				<text class="next-button-text-20">Sent</text>
			</StyledButton>
			<div class="OR-segment-container">
			    <hr class="segment-line">
			    <span class="segment-or-text">OR</span>
			    <hr class="segment-line">
			</div>
		</view>
	</view>
</template>

<script>
	import StyledButton from "../../components/StyledButton.vue"
	import ThirdPartyButton from "../../components/ThirdPartyButton.vue"
	export default {
		data() {
			return {
				title: 'Hellod'
			}
		},
		onLoad() {

		},
		components: {
			StyledButton
		},
		methods: {

		}
	}
</script>

<style>
	.column {
		display: flex;
		flex-direction: column;
		background-color: yellow;
		border: black 3rpx solid;
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
		border: 1px solid #CFDBD599
	}
	
	.segment-or-text {
	    padding: 0 3.1vw;
	    white-space: nowrap; 
		font-family: Urbanist;
		font-weight: 400;
		font-size: 3.2vw;
		color: #5D5D5B;
	}
</style>