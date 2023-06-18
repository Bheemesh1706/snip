<script lang="ts">
	import { dimensions } from '../lib/dimention';
	import { onMount, afterUpdate } from 'svelte';
	import { get } from 'svelte/store';

	var startX = 0;
	var startY = 0;
	var mouseX = 0;
	var mouseY = 0;
	var mousedown = false;
	var offsetX = 0;
	var offsetY = 0;
	var scrollX = 0;
	var scrollY = 0;
	var screenRatio = 0;
	var canvasW =0;
	var canvasH=0;
	// Capture screenshot of a specific area
	function captureScreenshot(x: number, y: number, width: number, height: number) {
		navigator.mediaDevices
			.getDisplayMedia({ video: true })
			.then((stream) => {
				const videoTrack = stream.getVideoTracks()[0];
				const videoElement = document.createElement('video');
				videoElement.srcObject = new MediaStream([videoTrack]);

				videoElement.onloadedmetadata = () => {
					const videoWidth = videoElement.videoWidth;
					const videoHeight = videoElement.videoHeight;

					const canvas = document.createElement('canvas');
					canvas.width = width;
					canvas.height = height;

					const context = canvas.getContext('2d');

					context?.drawImage(videoElement, x, y, width, height, 0, 0, width, height);

					canvas.toBlob((blob) => {
						const screenshotUrl = URL.createObjectURL(blob as Blob);

						// Open the screenshot in a new window/tab
						window.open(screenshotUrl);

						// Clean up the resources
						URL.revokeObjectURL(screenshotUrl);
					}, 'image/png');

					// Stop the video stream and clean up resources
					stream.getTracks().forEach((track) => track.stop());
				};

				videoElement.play();
			})
			.catch((error) => {
				console.error('An error occurred while accessing the screen:', error);
			});
	}

	// Calculate canvas dimensions based on window size
	function calculateCanvasDimensions() {
		const { innerWidth, innerHeight } = get(dimensions);
		canvasW = innerWidth;
		canvasH = innerHeight;
	}
	onMount(() => {
		calculateCanvasDimensions();
	});

	// Update canvas dimensions on window resize
	afterUpdate(() => {
		calculateCanvasDimensions();
	});

	//Handle mouse event
	const handleMouseDown = (event: MouseEvent) => {
		calculateCanvasDimensions();
		const canvas = document.getElementById('snip') as HTMLCanvasElement;
		offsetX = canvas?.offsetLeft as number;
		offsetY = canvas?.offsetTop as number;
		startX = event.clientX - offsetX;
		startY = event.clientY - offsetY;
		scrollX = canvas?.scrollLeft as number;
		scrollY = canvas?.scrollTop as number;
		screenRatio = canvas.width / canvas.height;
		console.log(screenRatio);
		mousedown = true;
		console.log(event);
	};

	const handleTouchStart = (event: TouchEvent) => {
		console.log(event);
		console.log('touch  start');
	};

	const handleMouseUp = (event: MouseEvent) => {
		// event.preventDefault();
		// event.stopPropagation();
		mousedown = false;
	};

	const handleMouse = (event: MouseEvent) => {
		// event.preventDefault();
		// event.stopPropagation();

		if (!mousedown) return;

		mouseX = event.clientX - offsetX;
		mouseY = event.clientY - offsetY;

		var canvas = document.getElementById('snip') as HTMLCanvasElement;
		var ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
		var width = mouseX - startX;
		var height = mouseY - startY;
		ctx?.strokeRect(startX, startY, width, height);
	};

	const handleTouchMove = (event: TouchEvent) => {
		console.log(event);
		console.log('touch move');
	};

	function handleClick() {
		// captureScreenshot(0, 0, 500, 500);

		const element = document.createElement('canvas');
		element.style.position = 'fixed';
		element.style.top = '0';
		element.style.left = '0';
		// element.style.height = String(canvasH)+'px';
		// element.style.width = String(canvasW)+'px';
		element.style.backgroundColor = 'red';
		element.style.zIndex = '10';
		element.id = 'snip';
		element.addEventListener('mousedown', handleMouseDown);
		element.addEventListener('mouseup', handleMouseUp);
		element.addEventListener('mousemove', handleMouse);
		element.addEventListener('touchstart', handleTouchStart);
		element.addEventListener('touchmove', handleTouchMove);

		document.body.appendChild(element);
	}
</script>

<div id="main">
	<h1>Snip Tool</h1>
	<button
		on:click={() => {
			console.log('Click');
			handleClick();
		}}
	>
		ScreenShot
	</button>
</div>

