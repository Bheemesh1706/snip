<script lang="ts">
	import camera from '../assests/camera.png';
	import videoCamera from '../assests/videoCamera.png';
	import { Modal, Group, Button } from '@svelteuidev/core';
	import { onMount } from 'svelte';
	import { ActionIcon } from '@svelteuidev/core';
	export let opened: boolean = false;

	export const closeModal = () => {
		opened = false;
	};
	let imgSrc = '';
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
	let cropper: any;
	onMount(() => {
		var upload = document.querySelector('#file-input');
		var save = document.querySelector('#save');
		let mediaRecorder: MediaRecorder | undefined;
		let recordedChunks: Blob[] = [];
		// upload?.addEventListener('change', (event) => {
		// 	const target = event.target as HTMLInputElement;
		// 	if (!target.files) return;
		// 	const file = target?.files[0];
		// 	const imgUrl = URL.createObjectURL(file);
		// 	const img = document.createElement('img');
		// 	img.src = imgUrl;
		// 	document.body.appendChild(img);
		// 	cropper = new Cropper(img);
		// });
		var videoButton = document.querySelector('#videoButton');
		var videoElement = document.querySelector('#videoElement') as HTMLVideoElement;

		videoButton?.addEventListener('click', (e) => {
			navigator.mediaDevices
				.getDisplayMedia({ video: true })
				.then(function (stream) {
					videoElement.srcObject = stream;
					document.body.appendChild(videoElement);

					mediaRecorder = new MediaRecorder(stream);

					mediaRecorder.ondataavailable = function (event: BlobEvent) {
						recordedChunks.push(event.data);
					};

					mediaRecorder.onstop = function () {
						const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });

						const downloadLink = document.createElement('a');
						downloadLink.href = URL.createObjectURL(recordedBlob);
						downloadLink.download = 'screen-recording.webm';
						downloadLink.click();

						recordedChunks = [];
					};

					mediaRecorder.start();
				})
				.catch(function (error) {
					console.error('Error capturing screen:', error);
				});
		});
		save?.addEventListener('click', (e) => {
			console.log('click');
			e.preventDefault();
			imgSrc = cropper?.getCroppedCanvas().toDataURL();
			const img = document.createElement('img');
			img.src = imgSrc;
			img.style.height = '500px';
			img.style.width = '500px';
			document.body.appendChild(img);
		});
	});

	// Function to create image slot

	function createImageSlot(screenshotUrl: string) {
		const screenShotModal = document.getElementById('screenShotModal');
		const img = document.createElement('img');
		img.id = 'screenshotImg';
		img.src = screenshotUrl;
		img.style.height = '400px';
		img.style.width = '700px';
		img.style.marginTop = '25px';
		screenShotModal?.appendChild(img);
		return img;
	}

	const screenShot = () => {
		const canvas = document.getElementById('screenshotCanvas') as HTMLCanvasElement;
		if (canvas) {
			const imgHolder = createImageSlot(canvas.toDataURL());
			canvas.remove();
		} else {
			imgSrc = cropper?.getCroppedCanvas().toDataURL();
			cropper.destroy();
			const imgHolder = document.getElementById('screenshotImg') as HTMLImageElement;
			imgHolder.src = imgSrc;
		}
	};

	const cropScreenShot = () => {
		const canvas = document.getElementById('screenshotCanvas') as HTMLCanvasElement;

		if (canvas) {
			const imgHolder = createImageSlot(canvas.toDataURL());
			canvas.remove();
			cropper = new Cropper(imgHolder, {
				zoomable: false
			});
		} else {
			const imgHolder = document.getElementById('screenshotImg') as HTMLImageElement;
			cropper = new Cropper(imgHolder, {
				zoomable: false
			});
		}
	};

	const createCanvas = () => {
		const canvas = document.createElement('canvas');
		canvas.width = 775;
		canvas.height = 400;
		const ctx = canvas.getContext('2d');
		var backGround = new Image();
		backGround.src = imgSrc;
		backGround.onload = function () {
			ctx?.drawImage(backGround, 0, 0, canvas.width, canvas.height);
		};
		canvas.id = 'screenshotCanvas';
		cropper.destroy();
		const imgHolder = document.getElementById('screenshotImg') as HTMLImageElement;
		imgHolder.remove();

		const screenShotModal = document.getElementById('screenShotModal');
		screenShotModal?.append(canvas);
	};

	// Capture screenshot of a specific area
	function captureScreenshot() {
		const webpageHeight = document.documentElement.clientHeight;
		const webpageWidth = document.documentElement.clientWidth;

		navigator.mediaDevices
			.getDisplayMedia({ video: true })
			.then((stream) => {
				const videoTrack = stream.getVideoTracks()[0];
				const videoElement = document.createElement('video');
				videoElement.srcObject = new MediaStream([videoTrack]);

				videoElement.onloadedmetadata = () => {
					const canvas = document.createElement('canvas');
					canvas.width = webpageWidth;
					canvas.height = webpageHeight;

					const context = canvas.getContext('2d');
					context?.drawImage(videoElement, 0, 0, webpageWidth, webpageHeight);
					opened = true;
					canvas.toBlob((blob) => {
						const screenshotUrl = URL.createObjectURL(blob as Blob);

						// Open the screenshot in a new window/tab
						const img = createImageSlot(screenshotUrl);
						console.log(img);
						cropper = new Cropper(img, {
							zoomable: false
						});

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
			console.log(startX, startY, width, height);
			var canvas = document.getElementById('snip') as HTMLCanvasElement;
			canvas.remove();
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
		console.log(startX, startY, width, height);
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
		console.log(startX, startY, width, height);
	};

	const handleTouchMove = (event: TouchEvent) => {
		console.log(event);
		console.log('touch move');
	};

	function handleClick() {
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

<svelte:head>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.css"
		rel="stylesheet"
	/>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.min.js"
	></script>
</svelte:head>

<div class="modalContainer">
	<section class="navBar">
		<button
			on:click={() => {
				console.log('Click');
				captureScreenshot();
			}}
		>
			<img src={camera} alt="" class="icon" />
		</button>

		<img src={videoCamera} alt="" class="icon" />
	</section>
	<div class="bodyContainer">
		<section class="bodyLeft" />
		<section class="bodyRight" />
	</div>
	<Modal {opened} centered overflow="outside" size="815px" on:close={() => closeModal()}>
		<div class="modalContainer">
			<div class="screenShotModal" id="screenShotModal" />

			<div class="buttonContainer">
				<ActionIcon
					on:click={() => {
						screenShot();
					}}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M3.5 8.00684e-07C3.77614 7.88614e-07 4 0.223859 4 0.500001L4 3.00006L11.5 3.00006C11.7761 3.00006 12 3.22392 12 3.50006L12 11.0001L14.5 11C14.7761 11 15 11.2238 15 11.5C15 11.7761 14.7762 12 14.5 12L12 12.0001L12 14.5C12 14.7761 11.7761 15 11.5 15C11.2239 15 11 14.7761 11 14.5L11 12.0001L3.5 12.0001C3.22386 12.0001 3 11.7762 3 11.5001L3 4.00005L0.499989 4C0.223847 4 -6.10541e-06 3.77613 -5.02576e-07 3.49999C5.13006e-06 3.22385 0.223867 3 0.50001 3L3 3.00005L3 0.500001C3 0.223859 3.22386 8.12755e-07 3.5 8.00684e-07ZM4 4.00006L4 11.0001L11 11.0001L11 4.00006L4 4.00006Z"
							fill="currentColor"
							fill-rule="evenodd"
							clip-rule="evenodd"
						/></svg
					>
				</ActionIcon>
				<ActionIcon
					on:click={() => {
						cropScreenShot();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 15 15"
						><path
							fill="currentColor"
							fill-rule="evenodd"
							d="M12.5 2h-10a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5Zm-10-1A1.5 1.5 0 0 0 1 2.5v10A1.5 1.5 0 0 0 2.5 14h10a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 12.5 1h-10Z"
							clip-rule="evenodd"
						/></svg
					>
				</ActionIcon>

				<ActionIcon
					on:click={() => {
						createCanvas();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 15 15"
						><path
							fill="currentColor"
							fill-rule="evenodd"
							d="M11.854 1.146a.5.5 0 0 0-.707 0L3.714 8.578a1 1 0 0 0-.212.314L2.04 12.303a.5.5 0 0 0 .657.657l3.411-1.463a1 1 0 0 0 .314-.211l7.432-7.432a.5.5 0 0 0 0-.708l-2-2Zm-7.432 8.14l7.078-7.08L12.793 3.5l-7.078 7.078l-1.496.641l-.438-.438l.64-1.496Z"
							clip-rule="evenodd"
						/></svg
					>
				</ActionIcon>
			</div>
		</div>
	</Modal>
</div>

<style>
	.modalContainer {
		width: 775px;
		height: 800px;
		border-radius: 10px;
		background-color: aqua;
	}
	.navBar {
		height: 45px;
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		background-color: bisque;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}
	.icon {
		height: 25px;
		width: 25px;
		cursor: pointer;
	}
	.bodyLeft {
		height: 100%;
		width: 30%;
		background-color: aquamarine;
		border-bottom-left-radius: 10px;
	}
	.bodyRight {
		height: 100%;
		width: 70%;
		background-color: azure;
		border-bottom-right-radius: 10px;
	}
	.bodyContainer {
		height: 755px;
		width: 100%;
		background-color: blue;
		display: flex;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.screenShotModal {
		width: 775px;
		height: 400px;
		border-radius: 10px;
	}
	.modalContainer {
		width: 775px;
		height: 800px;
		border-radius: 10px;
		background-color: bisque;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.buttonContainer {
		width: 775px;
		height: 200px;
		background-color: aquamarine;
		display: flex;
	}
</style>
