<template>
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
						<wd-count-down ref="countDownItem" :time="60000" millisecond :auto-start="false" format="ss"
							@change="onCountDownChange" @finish="onCountDownFinish" style="display: none;" />
					</text>
				</span>
			</span>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				optValue: "1",
				showKeyboard: true,
				errorInfo: "",
				isCountDownVisible: false,
				countDownTime: 60
			}
		},
		onLoad() {},
		components: {},
		watch: {
			optValue(newValue, oldValue) {
				if (newValue.length === 6 && newValue !== '123456') {
					this.errorInfo = '密码错误'
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
				console.log(this.isCountDownVisible);
			},
			onCountDownFinish() {
				this.$refs.countDownItem.reset();
				this.isCountDownVisible = false;
				console.log(this.isCountDownVisible);
			},
			onCountDownChange(current) {
				this.countDownTime = current.seconds;
			}
		}
	}
</script>

<style lang="scss">
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

		.wd-password-input__item {
			width: calc(100% - 10.65vw);
			height: 7.8vh;
			border: 0.05em solid #D0D5DD !important;
			border-radius: 0.4em;
		}

		.wd-password-input__value {
			font-family: Avenir;
			font-weight: 700;
			font-size: 7.8vw;
			line-height: 6.9vh;
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
</style>