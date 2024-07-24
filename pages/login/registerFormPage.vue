<template>
	<view class="status_bar">
		<!-- 这里是状态栏 -->
	</view>
	<view class="main-container">
		<view class="column">
			<div class="progressBarContainer">
				<wd-progress :percentage="progressPercentage" hide-text color="#161616"
					custom-class="register-progress-bar" />
			</div>
			<uni-forms :modelValue="registerFormData" class="register-form">
				<span><text class="title-text-24">Please select an option below your identification 🌟</text></span>
				<radio-group @change="onGenderRadioChange">
					<span v-if="!isGenderListExpand" class="gender-radio-group">
						<radio :value="genderItems[0].value" class="gender-radio-select-container"
							:class="genderValue == genderItems[0].value ? 'gender-radio-checked': ''">
							<span class="gender-radio-icon">{{genderItems[0].icon}}</span>
							<text class="title-text-24 gender-radio-text">{{genderItems[0].name}}</text>
						</radio>
						<radio :value="genderItems[1].value" class="gender-radio-select-container"
							:class="genderValue == genderItems[1].value ? 'gender-radio-checked': ''">
							<span class="gender-radio-icon">{{genderItems[1].icon}}</span>
							<text class="title-text-24 gender-radio-text">{{genderItems[1].name}}</text>
						</radio>
						<span class="gender-radio-select-container gender-radio-select-container-other">
							<text class="title-text-24 gender-radio-text gender-text-other">other</text>
							<uni-icons type="right" size="2em" class="title-text-24 gender-icon-other" />
						</span>
					</span>
					<span v-else>
						<span v-for="item in genderItems">
							<radio :value="item.value">
							</radio>
						</span>
					</span>
				</radio-group>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				progressPercentage: 0,
				genderValue: "",
				isGenderListExpand: false,
				genderItems: [{
						value: 'male',
						name: 'male',
						icon: '👨',
					},
					{
						value: 'female',
						name: 'female',
						icon: '👩‍',
					},
					{
						value: 'more',
						name: 'more',
						icon: '👩‍',
					},
				],
				registerFormData: {

				}
			}
		},
		onLoad() {},
		components: {},
		methods: {
			onGenderRadioChange(value) {
				this.genderValue = value.detail.value;
				console.log(value.detail, this.genderValue);
				console.log(this.genderItems);
			}
		}
	}
</script>

<style lang="scss">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.progressBarContainer {
		display: flex !important;
		width: 100%;
		justify-content: center;
		margin-bottom: 8vh;

		.wd-progress {
			width: 30vw;
		}
	}

	.register-progress-bar .wd-progress__outer {
		height: 8px;
		border-radius: 21px !important;

		.wd-progress__inner {
			border-radius: 21px !important;
		}
	}

	.gender-radio-group {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10vh;
	}

	.gender-radio-select-container {
		height: 8.3rem;
		border: 0.2em #D0D5DD solid;
		border-radius: 1.4em;
		flex-basis: 40%;
		box-sizing: border-box;
		margin: 0vw 4.2vw 2.45vh 4.2vw;

		.uni-radio-wrapper {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
		}

		.uni-radio-input {
			display: none;
		}

		.gender-radio-icon {
			font-size: 3rem;
		}

		.gender-radio-text {
			font-size: 4.2vw;
		}

	}

	.gender-radio-checked {
		border: 0.2em #161616 solid;
	}

	.gender-radio-select-container-other {
		height: 3.8rem;
		flex-basis: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3.2vw;

		.gender-text-other {
			margin: auto;
			font-size: 4.2vw;
		}

		.gender-icon-other {}
	}
</style>