<script>
	import { clamp } from 'yootils';

	export let start = 0; 
	export let end = 1;   
	export let minValue = 2008; 
	export let maxValue = 2023;
    export let minSelectedValue;
    export let maxSelectedValue; 
	export let step = 1;     

	let leftHandle;
	let body;
	let slider;

	function draggable(node) {
		let x;
		let y;
		function handleMousedown(event) {
			if (event.type === 'touchstart') {
				event = event.touches[0];
			}
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragstart', {
				detail: { x, y }
			}));
			window.addEventListener('mousemove', handleMousemove);
			window.addEventListener('mouseup', handleMouseup);
			window.addEventListener('touchmove', handleMousemove);
			window.addEventListener('touchend', handleMouseup);
		}
		function handleMousemove(event) {
			if (event.type === 'touchmove') {
				event = event.changedTouches[0];
			}
			const dx = event.clientX - x;
			const dy = event.clientY - y;
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragmove', {
				detail: { x, y, dx, dy }
			}));
		}
		function handleMouseup(event) {
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragend', {
				detail: { x, y }
			}));
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('touchmove', handleMousemove);
			window.removeEventListener('touchend', handleMouseup);
		}
		node.addEventListener('mousedown', handleMousedown);
		node.addEventListener('touchstart', handleMousedown);
		return {
			destroy() {
				node.removeEventListener('mousedown', handleMousedown);
				node.removeEventListener('touchstart', handleMousedown);
			}
		};
	}

	function quantize(value, step, min, max) {
		const range = max - min;
		return Math.round(value * range / step) * step / range;
	}

	function setHandlePosition(which) {
		return function (evt) {
			const { left, right } = slider.getBoundingClientRect();
			const parentWidth = right - left;
			let p = clamp((evt.detail.x - left) / parentWidth, 0, 1);
			p = quantize(p, step, minValue, maxValue); // [NEW] Snap to step in mapped range
			if (which === 'start') {
				start = p;
				end = Math.max(end, p);
                minSelectedValue = toValue(start);
                maxSelectedValue = toValue(end);
			} else {
				start = Math.min(p, start);
				end = p;
                minSelectedValue = toValue(start);
                maxSelectedValue = toValue(end);
			}
		};
	}

	function setHandlesFromBody(evt) {
		const { width } = body.getBoundingClientRect();
		const { left, right } = slider.getBoundingClientRect();
		const parentWidth = right - left;
		const leftHandleLeft = leftHandle.getBoundingClientRect().left;
		let pxStart = clamp((leftHandleLeft + evt.detail.dx) - left, 0, parentWidth - width);
		let pxEnd = clamp(pxStart + width, width, parentWidth);
		pxStart = quantize(pxStart / parentWidth, step, minValue, maxValue); // [NEW] Quantize start
		pxEnd = quantize(pxEnd / parentWidth, step, minValue, maxValue);   // [NEW] Quantize end
		start = pxStart;
		end = pxEnd;
        minSelectedValue = toValue(start)
        maxSelectedValue = toValue(end)
	}

	// [NEW] Convert slider percentage (0-1) to actual value
	function toValue(percentage) {
		return Math.round(percentage * (maxValue - minValue) + minValue);
	}

	// [NEW] Convert actual value to slider percentage (0-1)
	function toPercentage(value) {
		return (value - minValue) / (maxValue - minValue);
	}
</script>

<div class="double-range-container">
	<div class="slider" bind:this={slider}>
		<div
			class="body"
			bind:this={body}
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlesFromBody}"
			style="
				left: {100 * start}%;
				right: {100 * (1 - end)}%;
			"
		></div>
		<div
			class="handle"
			bind:this={leftHandle}
			data-which="start"
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlePosition('start')}"
			style="
				left: {100 * start}%;
			"
		></div>
		<div
			class="handle"
			data-which="end"
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlePosition('end')}"
			style="
				left: {100 * end}%;
			"
		></div>
	</div>
</div>

<style>
	.double-range-container {
		width: 100%;
		height: 20px;
		user-select: none;
		box-sizing: border-box;
		white-space: nowrap
	}
	.slider {
		position: relative;
		width: 100%;
		height: 6px;
		top: 50%;
		transform: translate(0, -50%);
		background-color: #e2e2e2;
		box-shadow: inset 0 7px 10px -5px #4a4a4a, inset 0 -1px 0px 0px #9c9c9c;
		border-radius: 1px;
	}
	.handle {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
	}
	.handle:after {
		content: ' ';
		box-sizing: border-box;
		position: absolute;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		background-color: #fdfdfd;
		border: 1px solid #7b7b7b;
		transform: translate(-50%, -50%)
	}
	/* .handle[data-which="end"]:after{
		transform: translate(-100%, -50%);
	} */
	.handle:active:after {
		background-color: #ddd;
		z-index: 9;
	}
	.body {
		top: 0;
		position: absolute;
		background-color: #34a1ff;
		bottom: 0;
	}
</style>