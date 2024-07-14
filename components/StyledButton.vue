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
			}
		},
		computed: {
			computedStyles() {
				return {
					width: this.width,
					height: this.height,
					borderRadius: this.borderRadius,
					backgroundColor: this.backgroundColor,
					color: 'white', // Default text color
					padding: '14rpx, 24rpx, 14rpx, 24rpx',
					border: 'none',
					cursor: 'pointer',
					transition: 'background-color 0.3s'
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