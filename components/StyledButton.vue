<template>
	<button :style="computedStyles">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: 'StyledButton',
		props: {
			width: {
				type: String,
				default: 'auto'
			},
			height: {
				type: String,
				default: 'auto'
			},
			borderRadius: {
				type: String,
				default: '24rpx'
			},
			backgroundColor: {
				type: String,
				default: '#3498db'
			},
			padding: {
				type: String,
				default: '14rpx, 24rpx, 14rpx, 24rpx'
			},
			border: {
				type: String,
				default: 'none'
			},
			transition: {
				type: String,
				default: 'background-color 0.3s'
			},
		},
		computed: {
			computedStyles() {
				return {
					width: this.width,
					height: this.height,
					borderRadius: this.borderRadius,
					backgroundColor: this.backgroundColor,
					padding: this.padding,
					border: this.border,
					transition: this.transition
				};
			}
		}
	};
</script>

<style scoped>
	button:hover {
		background-color: darken(#3498db, 10%);
	}
</style>