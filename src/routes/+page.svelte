<svelte:head>
	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.css"
		rel="stylesheet"
	/>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.min.js"
	></script>
</svelte:head>

<script lang>
	import Modal from '../components/Modal.svelte';
	import ScreenShot from '../components/ScreenShot.svelte';

</script>


<div id="main" class="mainContainer">
	<Modal/>
	<ScreenShot/>
	<!-- <h1>Snip Tool</h1>
	<button
		on:click={() => {
			console.log('Click');
			captureScreenshot();
		}}
	>
		ScreenShot
	</button>
	<input type="file" id="file-input" accept="image/jpeg, image/png, image/jpg">
	<button id="save">Save</button>
	<button id="videoButton">Capture Video</button>
	<video id="videoElement" autoplay height="500px" width="500px" /> -->

</div>

<style>
.mainContainer{
	/* height: 100vh;
	width: 100vw; */
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
</style>
