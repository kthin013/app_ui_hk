<template>
	<uni-nav-bar statusBar border="false" leftWidth="0px" rightWidth="0px" class="progress-nav-bar">
		<div class="progressBarContainer">
			<wd-progress :percentage="progressPercentageArray[progressPercentage]" hide-text color="#161616"
				custom-class="register-progress-bar" />
		</div>
	</uni-nav-bar>
	<view class="main-container">
		<view class="column">
			<uni-forms :modelValue="registerFormData" class="register-form">
				<!-- page 0 -->
				<div v-show="progressPercentage == 0">
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
							<span class="gender-radio-select-container gender-radio-select-container-other"
								@click="onGenderOtherClick">
								<text class="title-text-24 gender-radio-text gender-text-other">other</text>
								<uni-icons type="right" size="2em" class="title-text-24 gender-icon-other" />
							</span>
						</span>
						<span v-else>
							<span class="gender-radio-group">
								<radio v-for="item in genderItems" :value="item.value"
									class="gender-radio-select-container"
									:class="genderValue == item.value ? 'gender-radio-checked': ''">
									<span class="gender-radio-icon">{{item.icon}}</span>
									<text class="title-text-24 gender-radio-text">{{item.name}}</text>
								</radio>
							</span>
						</span>
					</radio-group>
				</div>
				<!-- page 1 -->
				<div v-show="progressPercentage == 1">
					<span><text class="title-text-24">What is your nickname and birthday?</text></span>
					<span class="nick-name-birthday-container">
						<input type="nickname" v-model="nickname" placeholder="" class="nick-name-input" maxlength="20"
							@input="onCheckPageTurn" />
						<picker mode="date" :value="birthday" @change="onBirthdayChange" fields="year month day">
							<div v-if="birthday.includes(0)"
								class=" date-placeholder birthday-picker next-button-text-20">
								<view class="date-container">YY</view>
								<view class="date-container date-middle-container">MM</view>
								<view class="date-container">DD</view>
							</div>
							<div v-else class="date-input-text birthday-picker next-button-text-20">
								<view class="date-container">{{birthday[0]}}</view>
								<view class="date-container date-middle-container">{{birthday[1]}}</view>
								<view class="date-container">{{birthday[2]}}</view>
							</div>
						</picker>

					</span>
				</div>
				<!-- page 2 -->
				<div v-show="progressPercentage == 2">
					<span><text class="title-text-24">Your relationship goals 💘</text></span>
					<radio-group @change="onRelationshipRadioChange" class="relationship-radio-group">
						<radio v-for="item in relationshipGoalList" :value="item.id"
							class="title-text-24 relationship-item-container"
							:class="relationshipGoal == item.id ? 'relationship-radio-checked': ''">
							<span class="relationship-item-text">{{item.name}}</span>
							<text class="relationship-item-icon">{{item.icon}}</text>
						</radio>
					</radio-group>
				</div>
				<!-- page 2 -->
				<div v-show="progressPercentage == 3">
					<div class="nationality-container">
						<span>
							<text class="title-text-24 .nationality-question-text">Where are you from</text>
						</span>
						<button class="next-button-text-20 nationality-question-button" @click="()=>{
								onClickCountryLanguageButton('country'); 
							}">
							Choose Country
						</button>
						<span>
							<text class="title-text-24 nationality-question-text">What is your national language</text>
						</span>
						<button class="next-button-text-20 nationality-question-button" @click="()=>{
									onClickCountryLanguageButton('language'); 
								}">
							Choose Country
						</button>
					</div>
				</div>
			</uni-forms>
		</view>
	</view>
	<countryActionModal :title="countryActionModalObj.title" :value="countryActionModalObj.value"
		:isModalVisible="countryActionModalObj.isCountryActionModalVisible" @onClickItem="onClickCountryLanguageItem"
		@onClickCollapseIcon="onClickCountryLanguageButton" />
	<wd-tabbar fixed safeAreaInsetBottom placeholder class="next-page-tabbar">
		<wd-button :disabled="isBackButtonDisable" class="back-button" @click="onPageTurn('back')"><uni-icons
				type="left" size="2em" /></wd-button>
		<wd-button :disabled="isNextButtonDisable" class="next-button next-button-text-20"
			@click="onPageTurn('next')">Next</wd-button>
	</wd-tabbar>
</template>

<script>
	import countryActionModal from '../../components/countryActionModal.vue';
	export default {
		data() {
			return {
				// progressPercentage: 0,				
				progressPercentage: 3,
				progressPercentageArray: [0.0000001, 10, 20, 30],
				genderValue: "",
				nickname: "",
				birthday: [0, 0, 0],
				isGenderListExpand: false,
				isBackButtonDisable: true,
				isNextButtonDisable: true,
				relationshipGoal: 0,
				genderItems: [{
						value: 'male',
						name: 'male',
						icon: '👨',
						id: 0
					},
					{
						value: 'female',
						name: 'female',
						icon: '👩‍',
						id: 0
					},
					{
						value: 'more',
						name: 'more',
						icon: '👩‍',
						id: 0
					},
					{
						value: '1',
						name: '1',
						icon: '👩‍',
						id: 0
					},
					{
						value: '2',
						name: '2',
						icon: '👩‍',
						id: 0
					},
					{
						value: '3',
						name: '3',
						icon: '👩‍',
						id: 0
					},
					{
						value: '4',
						name: '4',
						icon: '👩‍',
						id: 0
					},
				],
				relationshipGoalList: [{
						id: 1,
						name: 'dating',
						icon: '👩‍❤️‍👨‍',
					}, {
						id: 2,
						name: 'Friendship',
						icon: '🙌',
					},
					{
						id: 3,
						name: 'Casual',
						icon: '😄‍',
					},
					{
						id: 4,
						name: 'Serious Relationship',
						icon: '💍‍',
					},
					{
						id: 5,
						name: 'Open to Options',
						icon: '🌟‍',
					},
					{
						id: 6,
						name: 'Learning English',
						icon: '🤝',
					},
					{
						id: 7,
						name: 'Exploration',
						icon: '🌍',
					}
				],
				registerFormData: {

				},
				countryActionModalObj: {
					countryValue: {
						title: "Country/Region",
						value: "",
					},
					translationValue: {
						title: "Languages",
						value: "",
					},
					title: "",
					value: "",
					isCountryActionModalVisible: false,
				}
			}
		},
		onLoad() {},
		components: {
			countryActionModal
		},
		methods: {
			onGenderRadioChange(value) {
				this.genderValue = value.detail.value;
				this.onCheckPageTurn();
			},
			onGenderOtherClick() {
				this.isGenderListExpand = true;
			},
			onBirthdayChange(item) {
				//yy-mm-dd
				let birthdayString = item.detail.value;
				this.birthday = birthdayString.split('-');
				this.onCheckPageTurn();
			},
			onRelationshipRadioChange(value) {
				this.relationshipGoal = value.detail.value;
				this.onCheckPageTurn();
			},
			onClickCountryLanguageButton(action) {
				this.countryActionModalObj.isCountryActionModalVisible = !this.countryActionModalObj
					.isCountryActionModalVisible;
				if (action == 'country') {
					this.countryActionModalObj.title = this.countryActionModalObj.countryValue.title;
					this.countryActionModalObj.value = this.countryActionModalObj.countryValue.value;
				} else if (action == 'language') {
					this.countryActionModalObj.title = this.countryActionModalObj.translationValue.title;
					this.countryActionModalObj.value = this.countryActionModalObj.translationValue.value;
				} else {
					this.countryActionModalObj.title = '';
					this.countryActionModalObj.value = '';
				}
				console.log(this.countryActionModalObj);
			},
			onClickCountryLanguageItem(item) {
				this.countryActionModalObj.value = item.name;
				if (this.countryActionModalObj.title == 'Country/Region') {
					this.countryActionModalObj.countryValue.value = item.name;
				} else if (this.countryActionModalObj.title == 'Languages') {
					this.countryActionModalObj.translationValue.value = item.name;
				}
			},
			onCheckPageTurn() {
				if (this.progressPercentage == 0) {
					// page 0
					this.isBackButtonDisable = true;
					if (this.genderValue != '') {
						this.isNextButtonDisable = false;
						return true;
					}
				}
				if (this.progressPercentage == 1) {
					// page 1
					this.isBackButtonDisable = false;
					console.log(this.nickname, this.birthday)
					if (this.nickname != "" && !this.birthday.includes(0)) {
						this.isNextButtonDisable = false;
						return true;
					}
				}
				if (this.progressPercentage == 2) {
					// page 2
					this.isBackButtonDisable = false;
					console.log(this.relationshipGoal)
					if (this.relationshipGoal != 0) {
						this.isNextButtonDisable = false;
						return true;
					}
				}
				return false;
			},
			onPageTurn(action) {
				if (action == "next") {
					// next page
					this.progressPercentage += 1;
					this.isNextButtonDisable = true;
				} else if (action == "back") {
					this.progressPercentage -= 1;
					console.log(this.progressPercentage);
				}
				this.onCheckPageTurn();
			}
		}
	}
</script>

<style lang="scss">
	.progress-nav-bar {
		.uni-navbar--border {
			border-bottom-width: 0;
			border-bottom-style: none;
			border-bottom-color: transparent;
		}
	}

	.progressBarContainer {
		display: flex !important;
		width: 100%;
		justify-content: center;
		align-items: center;

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
	}

	.gender-radio-select-container-other:active {
		border: 0.2em #161616 solid;
	}


	// page 1
	.nick-name-birthday-container {
		display: flex;
		flex-direction: column;
		margin-top: 10vh;

		.nick-name-input {
			height: 9.2vh;
			border: 0.1em #D0D5DD solid;
			border-radius: 0.4em;
			font-size: 3.2em;
			line-height: 5.1em;
			font-weight: 900;
			text-align: center;
			margin-bottom: 7.5vh;
		}
	}

	.birthday-picker {
		height: 4.8vh;
		display: flex;
		flex-direction: row;
		justify-content: space-around;

		.date-container {
			flex: 1;
			display: inherit;
			align-items: center;
			justify-content: center;
		}

		.date-middle-container {
			border-left: 0.1em #D0D5DD solid;
			border-right: 0.1em #D0D5DD solid;
		}
	}

	.date-placeholder {
		font-size: 2em;
		font-weight: 700;
		color: #9E9E9E;
	}

	.date-input-text {
		font-size: 2em;
		font-weight: 700;
		color: black;
	}

	// page 2
	.relationship-radio-group {
		display: flex;
		flex-direction: column;
		margin-top: 2.5vh;

		.relationship-item-container {
			padding: 1.6vh 4vw;
			font-size: 5.3vw;
			display: flex;
			align-items: center;
			border: 2px #EEEEEE solid;
			border-radius: 2.6vw;
			margin-bottom: 2.9vh;

			.uni-radio-input {
				display: none;
			}
		}

		.relationship-radio-checked {
			border: 2px #161616 solid;
		}
	}

	// page 3
	.nationality-container {
		display: flex;
		flex-direction: column;

		.nationality-question-text {
			font-size: 2.4em;
			letter-spacing: -0.02em;
			color: black;
		}

		.nationality-question-button {
			width: 100%;
			padding: 1.62vh 4.1vw;
			background-color: #FFFFFF;
			border: 0.1em #161616 solid;
			border-radius: 0.5em;
			margin-top: 3.4vh;
			margin-bottom: 7.9vh;
			font-size: 2em;
			font-family: Avenir;
			font-weight: 800;
			color: black;
		}
	}

	//search box in countryActionModal
	.country-search-box {
		height: 9.3vh !important;
		padding: 0px !important;

		.uni-searchbar__box {
			height: 100% !important;
			padding: 1.8em 2em;

			.uni-searchbar__box-search-input {
				font-family: Avenir !important;
				font-size: 1.2em !important;
				font-weight: 500 !important;
				color: black;
			}

			.uni-searchbar__text-placeholder {
				font-family: Avenir !important;
				font-size: 1.1em !important;
				font-weight: 500 !important;
			}
		}

		.wd-search__block {
			height: 100%;

			.wd-search__input {
				font-family: Avenir;
				font-size: 1.8em;
				font-weight: 500;
			}

			.wd-search__placeholder-txt {
				font-family: Avenir;
				font-size: 1.2em;
				font-weight: 500;
			}
		}
	}

	//country list scroll view in countryActionModal
	.uni-scroll-view-content {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		align-content: flex-start;
		gap: 3.2vw;
	}

	//tabbar
	.next-page-tabbar {
		height: 7.73vh;
		// margin: 0vh 3.27vh;

		.wd-tabbar--default {
			height: 10.7vh;
			padding: 0vh 6.4vw;
			align-items: flex-start;
			justify-content: space-between;
		}

		::after {
			background: none !important;
		}
	}

	.back-button {
		margin: 0px;
		width: 12.7vw !important;
		height: 12.7vw !important;
		min-width: unset !important;
		border-radius: 50% !important;
		background-color: white !important;
		border: 0.2em #D0D5DD solid !important;

		.uni-icons {
			color: #161616 !important;
		}
	}

	.back-button.wd-button--active:active::before {
		opacity: 0;
	}

	.back-button.wd-button--active {
		border: 0.2em #161616 solid !important;
	}

	.next-button {
		width: 61vw !important;
		height: 12.7vw !important;
		background-color: #161616 !important;
		margin: 0px;
		font-size: 1.5em !important;
		padding: auto;
	}
</style>