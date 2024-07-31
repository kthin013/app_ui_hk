<template>
	<view>
		<view class="country-actionsheet" :class="[show?'country-actionsheet-show':'']">
			<view class="actionsheet-header">
				<uni-icons type="down" size="6.4vw" />
				<text class="actionsheet-header-title">Languages</text>
			</view>
			<!-- 			<view :class="[isCancel?'country-operate-box':'']">
				<block v-for="(item,index) in itemList" :key="index">
					<view class="country-actionsheet-btn country-actionsheet-divider"
						:class="[(!isCancel && index==itemList.length-1)?'country-btn-last':'']"
						hover-class="country-actionsheet-hover" :hover-stay-time="150" :data-index="index"
						:style="{color:item.color || '#1a1a1a'}" @tap="handleClickItem">{{item.text}}</view>
				</block>
			</view> -->
			<wd-search class="country-search-box" placeholder="Search language" cancelButton="none" />
			<view class="actionsheet-body-container">
				<uni-search-bar class="country-search-box" placeholder="Search language" cancelButton="none" />
			</view>
			<!-- 			<view class="country-actionsheet-btn country-actionsheet-cancel" hover-class="country-actionsheet-hover"
				:hover-stay-time="150" v-if="isCancel" @tap="handleClickCancel">取消</view> -->
		</view>
		<!-- <view class="country-actionsheet-mask" :class="[show?'country-mask-show':'']" @tap="handleClickMask"></view> -->
	</view>
</template>

<script>
	export default {
		name: "tuiActionsheet",
		props: {
			//点击遮罩 是否可关闭
			maskClosable: {
				type: Boolean,
				default: true
			},
			//显示操作菜单
			show: {
				type: Boolean,
				default: true
			},
			//菜单按钮数组，自定义文本颜色，红色参考色：#e53a37
			itemList: {
				type: Array,
				default: function() {
					return [{
						text: "确定",
						color: "#1a1a1a"
					}]
				}
			},
			//提示文字
			tips: {
				type: String,
				default: ""
			},
			//提示文字颜色
			color: {
				type: String,
				default: "#9a9a9a"
			},
			//提示文字大小 rpx
			size: {
				type: Number,
				default: 26
			},
			//是否需要取消按钮
			isCancel: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			handleClickMask() {
				if (!this.maskClosable) return;
				this.handleClickCancel();
			},
			handleClickItem(e) {
				if (!this.show) return;
				const dataset = e.currentTarget.dataset;
				this.$emit('click', {
					index: dataset.index
				});
			},
			handleClickCancel() {
				this.$emit('chooseCancel');
			}
		}
	}
</script>

<style lang="scss">
	.country-actionsheet {
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
		min-height: 100rpx;
	}
	
	
	.country-search-box {
		height: 9.3vh !important;
		border: 1px solid black;
	
		.wd-search__block {
			font-size: 9.3vh !important;
		}
	}

	.country-actionsheet-show {
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}

	.actionsheet-header {
		width: 100%;
		height: 9.1vh;
		padding: 0vw 6.4vw;
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
		padding: 6.4vw;
	}

	.country-actionsheet-btn {
		width: 100%;
		height: 100rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 36rpx;
		position: relative;
	}

	.country-btn-last {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.country-actionsheet-divider::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.country-actionsheet-cancel {
		color: #1a1a1a;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.country-actionsheet-hover {
		background: #f7f7f9;
	}

	.country-actionsheet-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 9996;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.country-mask-show {
		opacity: 1;
		visibility: visible;
	}
</style>