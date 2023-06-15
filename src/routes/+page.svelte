<script lang="ts">
	var startX=0;
	var startY=0;
	var mousex = 0;
	var mousey = 0;
	var mousedown = false;
	var width: number;
	var height: number;
	var offsetX=0;
	var offsetY=0;
	var scrollX=0;
	var scrollY=0;
	// make var color a global variable
	var color = 'black';

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
		event.preventDefault();
    	event.stopPropagation();
		const canvas = document.getElementById('snip') as HTMLCanvasElement;
		offsetX = canvas?.offsetLeft as number;
		offsetY= canvas?.offsetTop as number;
		startX =  event.clientX - offsetX;
		startY = event.clientY - offsetY;
		scrollX= canvas?.scrollLeft as number;
		scrollY= canvas?.scrollTop as number;
		console.log(offsetX,offsetY,scrollX,scrollY,startX,startY);
		mousedown = true;
	};

	const handleMouseUp = (event: MouseEvent) => {
		event.preventDefault();
    	event.stopPropagation();
		mousedown = false;
	};

	const handleMouse = (event: MouseEvent) => {
		event.preventDefault();
    	event.stopPropagation();
		mousex = event.clientX - offsetX;
		mousey = event.clientY - offsetY;
		if (mousedown) {
			var canvas = document.getElementById('snip') as HTMLCanvasElement;
			var ctx = canvas?.getContext('2d');
			ctx?.clearRect(0,0, canvas.width, canvas.height);
			color = 'black';
			width= mousex - startX;
			height= mousey - startY;

			//for the new rect beginPath
			if (ctx) {
				ctx.beginPath();
				ctx.strokeRect(startX,startY, width , height );;
				ctx.strokeStyle = color;
				ctx.lineWidth = .1;
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
		element.style.height = '100%';
		element.style.width = '100%';
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


