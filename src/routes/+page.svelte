<svelte:head>
	<link  href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.css" rel="stylesheet">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.min.js"></script>
</svelte:head>
<script lang="ts">
	import { onMount } from "svelte";
	var startX = 0;
	var startY = 0;
	var mouseX = 0;
	var mouseY = 0;
	var mousedown = false;
	var offsetX = 0;
	var offsetY = 0;
	var scrollX = 0;
	var scrollY = 0;
	var scaleX = 1;
	var scaleY = 1;
	var width = 0;
	var height = 0;
	
	

	onMount(()=>{
		let cropper:any;
		var upload = document.querySelector("#file-input");
		var save = document.querySelector("#save");
		upload?.addEventListener('change',(event)=>{
			 const target= event.target as HTMLInputElement;
			 if (!target.files) return;
			 const file = target?.files[0];
			 const imgUrl = URL.createObjectURL(file);
			 const img = document.createElement("img");
			 img.src= imgUrl;
			 img.style.height="500px";
			 img.style.width="500px";
			 document.body.appendChild(img);
			 cropper = new Cropper(img);
			
		});
		save?.addEventListener("click",(e)=>{
			console.log("click")
			 e.preventDefault();
			 let imgSrc= cropper?.getCroppedCanvas().toDataURL();
			 const img = document.createElement("img");
			 img.src= imgSrc;
			 img.style.height="500px";
			 img.style.width="500px";
			 document.body.appendChild(img);

		})
		
	});

	// Capture screenshot of a specific area
	function captureScreenshot(x: number, y: number, width: number, height: number) {
		// const screenHeight = window.screen.height;
		const screenHeight = window.screen.availHeight;
		const webpageHeight = document.documentElement.clientHeight;
		const yOffset = screenHeight-webpageHeight;
		console.log(screenHeight,webpageHeight,yOffset)
		 navigator.mediaDevices
			.getDisplayMedia({ video: true })
			.then((stream) => {
				const videoTrack = stream.getVideoTracks()[0];
				const videoElement = document.createElement('video');
				videoElement.srcObject = new MediaStream([videoTrack]);

				videoElement.onloadedmetadata = () => {
					const canvas = document.createElement('canvas');
					canvas.width = width;
					canvas.height = height;

					const context = canvas.getContext('2d');
					context?.drawImage(videoElement, x, y+yOffset, width, height,0,0,width,height);

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
	function showPopUp() {
		var result = window.confirm('Do you like to take a screenshot?');

		if (result) {
			console.log(startX,startY,width,height);
			var canvas = document.getElementById('snip') as HTMLCanvasElement;
			canvas.remove();
			captureScreenshot(0, 0, 500, 500);
		} else {
			var canvas = document.getElementById('snip') as HTMLCanvasElement;
			var ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
			ctx?.clearRect(0, 0, canvas.width, canvas.height);
		}
	}
	//Handle mouse event
	const handleMouseDown = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const canvas = document.getElementById('snip') as HTMLCanvasElement;
		var rect = canvas.getBoundingClientRect();
		offsetX = canvas?.offsetLeft as number;
		offsetY = canvas?.offsetTop as number;
		scaleX = canvas.width / rect.width;
		scaleY = canvas.height / rect.height;
		startX = (event.clientX - offsetX) * scaleX;
		startY = (event.clientY - offsetY) * scaleY;
		scrollX = canvas?.scrollLeft as number;
		scrollY = canvas?.scrollTop as number;
		mousedown = true;
	};

	const handleTouchStart = (event: TouchEvent) => {
		console.log(event);
		console.log('touch  start');
	};

	const handleMouseUp = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		mousedown = false;
		console.log(startX,startY,width,height);
		showPopUp();
	};

	const handleMouse = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		if (!mousedown) return;

		mouseX = (event.clientX - offsetX) * scaleX;
		mouseY = (event.clientY - offsetY) * scaleY;

		var canvas = document.getElementById('snip') as HTMLCanvasElement;
		var ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
		width = mouseX - startX;
		height = mouseY - startY;
		ctx?.strokeRect(startX, startY, width, height);
		console.log(startX,startY,width,height);
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
		element.style.height = '100%';
		element.style.width = '100%';
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
	<!-- <button
		on:click={() => {
			console.log('Click');
			handleClick();
		}}
	>
		ScreenShot
	</button> -->
	<input type="file" id="file-input" accept="image/jpeg, image/png, image/jpg">
	<button id='save'>Save</button>
</div>
