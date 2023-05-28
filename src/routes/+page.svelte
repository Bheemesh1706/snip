<script>






// Capture screenshot of a specific area
/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
// Capture screenshot of a specific area
function captureScreenshot(x, y, width, height) {
  navigator.mediaDevices.getDisplayMedia({ video: true })
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

        context?.drawImage(
          videoElement,
          x, y, width, height,
          0, 0, width, height
        );

        canvas.toBlob((blob) => {

          const screenshotUrl = URL.createObjectURL(blob);

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
	
	function handleClick() {
		// capture()
    captureScreenshot(0, 0, 500, 500);
	}
</script>

<h1>Snip Tool</h1>
<button
	on:click={() => {
		console.log('Click');
		handleClick();
	}}
>
	ScreenShot
</button>
