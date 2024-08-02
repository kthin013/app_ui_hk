<template>
	<view>
		<view class="country-actionsheet" :class="[isModalVisible ?'country-actionsheet-show' : '']">
			<view class="actionsheet-header">
				<uni-icons type="down" size="6.4vw" @click="onClickCollapseIcon" />
				<text class="actionsheet-header-title">{{title}}</text>
			</view>

			<view class="actionsheet-body-container">
				<uni-search-bar v-model="searchValue" class="country-search-box" placeholder="Search language"
					cancelButton="none" radius="12" @input="onSearchCountry">
					<template v-slot:searchIcon>
						<uni-icons color="#999999" size="2em" type="search" />
					</template>
				</uni-search-bar>

				<scroll-view class="country-list-container" :scroll-y="true" :scroll-top="scrollTop"
					:scroll-with-animation="true">
					<view v-for="item in filterCountryArray" class="country-item"
						:class="item.name == value ? 'country-item-selected' : ''"
						@click="onClickItem(item)">
						{{item.name}} {{item.emoji}}
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import countryFlagEmoji from "../static/ISOCountryEmoji.js";

	export default {
		name: "tuiActionsheet",
		data() {
			return {
				countryArray: countryFlagEmoji.list,
				filterCountryArray: countryFlagEmoji.list,
				scrollTop: 0,
				searchValue: ''
			}
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			value: {
				type: String,
				default: ''
			},
			//显示操作菜单
			isModalVisible: {
				type: Boolean,
				default: false
			}
		},
		// computed: {
		// 	filterCountryArray() {
		// 		if (this.searchValue.trim().length > 0) {
		// 			return this.countryArray.filter((item) => item.name.toLocaleLowerCase().includes(
		// 				this.searchValue.toLocaleLowerCase()));
		// 		}
		// 		return this.countryArray;
		// 	}
		// },
		methods: {
			onSearchCountry(e) {
				console.log(e)
				if (e.trim().length > 0) {
					this.filterCountryArray = this.countryArray.filter((item) => item.name.toLocaleLowerCase().includes(
						e.toLocaleLowerCase()));
				} else {
					this.filterCountryArray = this.countryArray;
				}
			},
			onClickCollapseIcon() {
				this.$emit('onClickCollapseIcon', '');
			},
			onClickItem(item) {
				this.$emit('onClickItem', item)
			}
		}
	}
</script>

<style lang="scss">
	.country-actionsheet {
		height: 100%;
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		background: #fff;
	}

	.country-actionsheet-show {
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}

	.actionsheet-header {
		width: 100%;
		height: 9.1vh;
		padding: 2vh 6.4vw 0vh 6.4vw;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		text-align: center;

		.actionsheet-header-title {
			font-family: Avenir;
			font-weight: 800;
			font-size: 6.4vw;
			justify-content: center;
			margin: auto;
		}
	}

	.actionsheet-body-container {
		display: flex;
		flex-direction: column;
		padding: 3vh 6.4vw 5.4vh 6.4vw;
	}

	//search bar style please see the parent css registerForm.vue

	//country list please see the parent css registerForm.vue
	.country-list-container {
		height: 70vh;
		margin-top: 3.4vh;
		border: 1px solid black;
	}
	
	.country-item {
		height: 5.5vh;
		padding: 1.2vh 5.3vw;
		border: 0.1em solid #E0E0E0;
		border-radius: 6em;
		font-family: Avenir;
		font-size: 4.2vw;
		font-weight: 800;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.country-item-selected {
		color: white;
		background-color: black;
		border: 0.1em solid black;
	}
</style>