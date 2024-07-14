<template>
	<view class="main-container">
		<view class="column">
			<view class="title-container">
				<text class="title-text-24">Login/Sign</text>
			</view>
			<wd-input type="text" v-model="value" style="margin-bottom: 33rpx;" />
			<StyledButton width="100%" height="content-fit" backgroundColor="#161616" borderRadius="24rpx">
				<text class="title-text-24" style="font-size: 20rpx;">Next</text>
			</StyledButton>
		</view>
	</view>
</template>

<script>
	import StyledButton from "../../components/StyledButton.vue"

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
		margin: 25rpx 8rpx 56rpx 8rpx
	}

	.button-text {
		font-family: Manrope;
		font-size: 24rpx;
		font-weight: 800;
		line-height: 24rpx;
	}
</style>