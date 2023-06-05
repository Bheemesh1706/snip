<script lang="ts">
	let mouse = {};
	var canvasOffset = 0;
	var canvasx = 0;
	var canvasy = 0;
	var last_mousex = 0;
	var last_mousey = 0;
	var mousex = 0;
	var mousey = 0;
	var mousedown = false;
	var shapes: any[] = [];
	var width: number;
	var height: number;
	// make var col a global variable
	var col = 'black';
	var ad = '';

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

	//Handle mouse event
	const handleMouseDown = (event: MouseEvent) => {
		last_mousex = event.clientX - canvasx;
		last_mousey = event.clientY - canvasy;
		mousedown = true;
	};

	const handleMouseUp = (event: MouseEvent) => {
		const lastPos = {
			lastMouseX: last_mousex,
			lastMouseY: last_mousey,
			rectWidth: width,
			rectHeight: height,
			color: col,
			name: ad
		};
		shapes.push(lastPos);
		mousedown = false;
	};

	const handleMouse = (event: MouseEvent) => {
		mousex = event.clientX - canvasx;
		mousey = event.clientY - canvasy;

		if (mousedown) {
			var canvas = document.getElementById('snip') as HTMLCanvasElement;
			var ctx = canvas?.getContext('2d');
			ctx?.clearRect(0, 0, canvas.width, canvas.height);
			width = mousex - last_mousex;
			height = mousey - last_mousey;
			col = 'black';
			if (shapes.length > 0 && ctx) {
				for (var i in shapes) {
					// for every shape in the shapes array beginPath
					ctx.beginPath();
					//set the color of the stroke
					ctx.strokeStyle = shapes[i].color;
					//draw the rect
					ctx.rect(
						shapes[i].lastMouseX,
						shapes[i].lastMouseY,
						shapes[i].rectWidth,
						shapes[i].rectHeight
					);
					ctx.fillText(
						shapes[i].name,
						shapes[i].rectWidth - shapes[i].lastMouseX,
						shapes[i].rectHeight - shapes[i].lastMouseY
					);
					ctx.stroke();
				}
			}
			//for the new rect beginPath
			if (ctx) {
				ctx.beginPath();
				ctx.rect(last_mousex, last_mousey, width, height);
				ctx.strokeStyle = col;
				ctx.lineWidth = 3;
				ctx.fillText(ad, 100, 100);
				ctx.stroke();
			}
		}
	};

	function handleClick() {
		// captureScreenshot(0, 0, 500, 500);

		const element = document.createElement('canvas');
		element.style.position = 'absolute';
		element.style.top = '0';
		element.style.left = '0';
		element.style.height = '100vh';
		element.style.width = '100vw';
		element.style.zIndex = '10';
		element.id = 'snip';
		element.addEventListener('mousedown', handleMouseDown);
		element.addEventListener('mouseup',handleMouseUp);
		element.addEventListener('mousemove',handleMouse);
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

<style>
	.snip {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		background-color: transparent;
		width: 100vw;
		height: 100vh;
	}
</style>
