<template>
	<link rel="stylesheet" href="./iconfont.css">
	<view v-if="buttonType == 'email'" class="third-party-button">
		<uni-icons custom-prefix="iconfont" type="icon-email" size="3em" color="#424242"
			class="third-party-button-icon" />
		<text class="third-party-button-text">Continue with Email</text>

	</view>
	<view v-else-if="buttonType == 'google'" class="third-party-button">
		<div class="icon-google-container">
			<uni-icons custom-prefix="iconfont" type="icon-google" size="3em" color="#424242"
				class="third-party-button-icon" />
		</div>
		<text class="third-party-button-text">Continue with Google</text>
	</view>
	<view v-else-if="buttonType == 'wechat'" class="third-party-button">
		<uni-icons custom-prefix="iconfont" type="icon-weixin" size="3em" color="#424242"
			class="third-party-button-icon" />
		<text class="third-party-button-text">Continue with Wechat</text>
	</view>
	<view v-else-if="buttonType == 'facebook'" class="third-party-button">
		<uni-icons custom-prefix="iconfont" type="icon-facebook" size="3em" color="#424242"
			class="third-party-button-icon" />
		<text class="third-party-button-text">Continue with Facebook</text>
	</view>
</template>


<script>
	export default {
		name: "ThirdPartyButton",
		props: {
			buttonType: {
				type: String,
				default: ""
			},
		}
	}
</script>

<style scoped>
	.third-party-button {
		border: 0.1em solid rgba(0, 0, 0, 0.25);
		border-radius: 5em;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1.44vh 4.26vw ;
		margin-bottom: 2.21vh;
	}

	.icon-google-container {
		border: 0.1em solid rgba(0, 0, 0, 0.25);
		border-radius: 50%;
	}

	.third-party-button-text {
		font-family: Avenir;
		font-size: 2em;
		font-weight: 800;
		line-height: 2.13em;
		margin: auto;
	}
</style>