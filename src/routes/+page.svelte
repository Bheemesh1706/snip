<script lang="ts">
	import ModalMain from '../components/ModalMain.svelte';
	import ScreenShot from '../components/ScreenShot.svelte';
	import { SvelteUIProvider } from '@svelteuidev/core';
	import { Modal, Group, Button } from '@svelteuidev/core';

	let opened = false;

	const closeModal =()=>{
		opened=false;
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

<SvelteUIProvider>
	<div id="main" class="mainContainer">
		
		<ModalMain />
		<Modal {opened} centered overflow="outside" size="815px" on:close={closeModal} >
			<ScreenShot/>
		</Modal>
		<Group position="center">
			<Button on:click={() => (opened = true)}>Open Modal</Button>
		</Group>
	
	
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
</SvelteUIProvider>


<style>
	.mainContainer {
		/* height: 100vh;
	width: 100vw; */
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
