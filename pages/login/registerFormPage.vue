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
				<radio-group @change="onGenderRadioChange" class="gender-radio-group">
					<span v-for="item in genderItems">
						<radio :value="item.value" class="gender-radio-select">
							<span class="gender-radio-icon">{{item.icon}}</span>
							<text class="gender-radio-text">{{item.name}}</text>
						</radio>
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
				genderItems: [{
						value: 'male',
						name: 'male',
						icon: '👨'
					},
					{
						value: 'female',
						name: 'female',
						icon: '👩‍'
					},
					{
						value: 'other',
						name: 'other',
						icon: '👩‍'
					}
				],
				registerFormData: {

				}
			}
		},
		onLoad() {},
		components: {},
		methods: {
			onGenderRadioChange(value) {
				console.log(value.detail.value)
			}
		}
	}
</script>

<style lang="scss">
	@import url("../../uni_modules/uni-icons/components/uni-icons/uniicons.css");

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.progressBarContainer {
		display: flex !important;
		width: 100%;
		justify-content: center;
		margin-bottom: 8.38vh;

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

	.gender-radio-select {
		width: 32.8vw;
		height: 19.2vh;
		border: 1px black solid;
		border-radius: 1.4em;
		
		.uni-radio-input {
			display: none;
		}
		
		.uni-radio-wrapper {
			display: flex;
			flex-direction: column;
		}
		
		.gender-radio-icon {
			font-size: 4.8em;
		}
		
		.gender-radio-text {
			font-size: 1.6em;
		}
	}
</style>