<template>
	<uni-nav-bar left-icon="left" shadow statusBar class="custom-nav-bar" />
	<view class="main-container">
		<view class="column">
			<text class="title-text-24">Enter the 6 digit code</text>
			<wd-password-input v-model="optValue" :mask="false" :focused="showKeyboard" :gutter="'2.13vw'"
				:error-info=" errorInfo" @focus="() => showKeyboard=true" class="opt-input" />
			<wd-number-keyboard v-model="optValue" v-model:visible="showKeyboard" :maxlength="6" @input="onInput"
				@delete="onDelete" />
			<span class="resend-code-text">
				<text style="color:#667085;">Resend Code </text>
				<span>
					<text v-show="!isCountDownVisible" @click="onCountDownClick">Here</text>
					<text v-show="isCountDownVisible">
						{{countDownTime}} Sec
					</text>
					<wd-count-down ref="countDownItem" :time="60000" millisecond :auto-start="false" format="ss"
						@change="onCountDownChange" @finish="onCountDownFinish" style="display: none;" />
				</span>
			</span>
			<wd-popup v-model="isModalVisible" custom-class="login-modal" custom-style="" @close="onClose">
				<div class="animation-container">
					<uni-icons custom-prefix="iconfont" type="icon-person" size="37.5vw"
						class="login-modal-animation-icon" />
					<span class="breathing-dot breathing-dot-1" />
					<span class="breathing-dot breathing-dot-2" />
					<span class="breathing-dot breathing-dot-3" />
					<span class="breathing-dot breathing-dot-4" />
					<span class="breathing-dot breathing-dot-5" />
					<span class="breathing-dot breathing-dot-6" />
					<span class="breathing-dot breathing-dot-7" />
					<span class="breathing-dot breathing-dot-8" />
				</div>
				<text class="title-text-24">Log in Successful!</text>
				<wd-loading color="#161616" size="8.6vw" />
			</wd-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				optValue: "",
				showKeyboard: true,
				errorInfo: "",
				isCountDownVisible: false,
				countDownTime: 60,
				isModalVisible: false
			}
		},
		onLoad() {},
		components: {},
		watch: {
			optValue(newValue, oldValue) {
				if (newValue.length === 6 && newValue !== '123456') {
					this.errorInfo = '密码错误'
				} else if (newValue.length === 6 && newValue == '123456') {
					this.isModalVisible = true;
				} else {
					this.errorInfo = ''
				}
			}
		},
		methods: {
			onInput(value) {
				console.log(value, this.optValue.length)
			},
			onDelete() {

			},
			onCountDownClick() {
				this.$refs.countDownItem.start();
				this.isCountDownVisible = true;
			},
			onCountDownFinish() {
				this.$refs.countDownItem.reset();
				this.isCountDownVisible = false;
			},
			onCountDownChange(current) {
				this.countDownTime = current.seconds;
			},
			onClose() {

			}
		}
	}
</script>

<style lang="scss">
	@import url("../uni.scss");

	.column {
		display: flex;
		flex-direction: column;
	}

	.input-text {
		font-family: Avenir;
		color: black;
		font-weight: 800;
	}

	.opt-input {
		margin: 4.62vh 0vw 0vh 0vw !important;
		height: fit-content;

		.wd-password-input__security {
			height: 7.8vh;
		}

		.wd-password-input__item {
			width: calc(100% - 10.65vw);
			height: auto;
			border: 0.05em solid #D0D5DD !important;
			border-radius: 0.4em;
			padding: 10px 0;
		}

		.wd-password-input__value {
			font-family: Avenir;
			font-weight: 700;
			font-size: 7.8vw;
			// line-height: 6.9vh;
		}
	}

	.resend-code-text {
		margin-top: 2.74vh;
		font-family: Avenir;
		font-weight: 700;
		font-size: 3.7vw;
		line-height: 3.03vh;
	}

	.wd-number-keyboard {
		height: 51.5vh;
		background-color: #F9F9F9 !important;
		border-radius: 8.5vw 8.5vw 0 0;

		.wd-number-keyboard__body {
			height: 95%;
			padding: 1.3vh 1.5vw;

			.wd-key {
				background-color: #F9F9F9;
				height: 100%;
			}

			.wd-key:active {
				background-color: #e2e2e2;
			}
		}
	}

	.login-modal {
		width: 87vw;
		height: 67vh;
		border-radius: 2.4em;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}

	.animation-container {
		border: 5px solid black;
		width: 50vw;
		height: 28vh;
		position: relative;
	}

	.login-modal-animation-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: $primary_color !important;
	}

	$random-size-1: (
		random($limit: 5) + 3vw
	);
	$random-size-2: (
		random($limit: 3) + 4vw
	);
	$random-size-3: (
		random($limit: 3) + 1vw
	);
	$random-size-4: (
		random($limit: 5) + 2vw
	);
	$random-size-5: (
		random($limit: 6) + 1vw
	);
	$random-size-6: (
		random($limit: 3) + 1vw
	);

	.breathing-dot {
		position: absolute;
		border-radius: 50%;
		background: $primary-color;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes breathing {
		0% {
			transform: scale(.6);
		}

		50% {
			transform: scale(1);
		}

		100% {
			transform: scale(.6);
		}
	}

	@keyframes breathing-2 {
		0% {
			transform: scale(.8);
		}

		70% {
			transform: scale(1.1);
		}

		100% {
			transform: scale(.8);
		}
	}

	.breathing-dot-1 {
		width: $random-size-1;
		height: $random-size-1;
		top: random($limit: 10) + 15%;
		left: random($limit: 3) + 0%;
		animation-name: breathing;
		animation-duration: random($limit: 3) + 5s;
	}

	.breathing-dot-2 {
		width: $random-size-2;
		height: $random-size-2;
		top: random($limit: 8) + 0%;
		right: random($limit: 8) + 0%;
		animation-name: breathing;
		animation-duration: random($limit: 3) + 5s;
	}

	.breathing-dot-3 {
		width: $random-size-3;
		height: $random-size-3;
		bottom: (random($limit: 5) + 7%);
		left: (random($limit: 10) + 0%);
		animation-name: breathing-2;
		animation-duration: random($limit: 3) + 2s;
	}

	.breathing-dot-4 {
		width: $random-size-4;
		height: $random-size-4;
		bottom: (random($limit: 5) + 30%);
		right: (random($limit: 5) + 0%);
		animation-name: breathing;
		animation-duration: random($limit: 2) + 5s;
	}

	.breathing-dot-5 {
		width: $random-size-5;
		height: $random-size-5;
		bottom: (random($limit: 5) + 0%);
		right: (random($limit: 5) + 5%);
		animation-name: breathing-2;
		animation-duration: random($limit: 3) + 2s;
	}

	.breathing-dot-6 {
		width: $random-size-6;
		height: $random-size-6;
		top: (random($limit: 3) + 5%);
		right: (random($limit: 1) + 40%);
		animation-name: breathing-2;
		animation-duration: random($limit: 2) + 2s;
	}

	.breathing-dot-7 {
		width: $random-size-6;
		height: $random-size-6;
		top: (random($limit: 3) + 5%);
		right: (random($limit: 1) + 60%);
		animation-name: breathing-2;
		animation-duration: random($limit: 2) + 1s;
	}

	.breathing-dot-8 {
		width: $random-size-6;
		height: $random-size-6;
		bottom: (random($limit: 3) + 4%);
		right: (random($limit: 1) + 50%);
		animation-name: breathing-2;
		animation-duration: random($limit: 2) + 1s;
	}
</style>