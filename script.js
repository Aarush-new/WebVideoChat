// Set up PeerJS and connect to signaling server
const peer = new Peer();
peer.on('open', id => {
  alert(id);
});

// Get the local video stream
navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then(stream => {
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;

    // Call other peers when a new connection is established
    peer.on('connection', conn => {
      const call = peer.call(conn.peer, stream);
      call.on('stream', remoteStream => {
        addVideo(remoteStream, conn.peer);
      });
    });

    // Answer incoming calls from other peers
    peer.on('call', call => {
      call.answer(stream);
      call.on('stream', remoteStream => {
        addVideo(remoteStream, call.peer);
      });
    });
  })
  .catch(error => {
    console.error('Error getting user media:', error);
  });

// Add a new video element to the grid for each new user
function addVideo(stream, peerId) {
  const videoContainer = document.querySelector('.video-container');
  const video = document.createElement('video');
  video.srcObject = stream;
  video.autoplay = true;
  video.setAttribute('data-peer-id', peerId);
  videoContainer.appendChild(video);
  updateGrid();
}

// Update the grid layout based on the number of users
function updateGrid() {
  const videoContainer = document.querySelector('.video-container');
  const numVideos = videoContainer.childElementCount;
  videoContainer.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(numVideos))}, 1fr)`;
}

// Toggle the local video stream on/off
function toggleVideo() {
  const localStream = document.getElementById('localVideo').srcObject;
  const tracks = localStream.getVideoTracks();
  tracks.forEach(track => {
    track.enabled = !track.enabled;
  });
}

// Toggle the local audio stream on/off
function toggleAudio() {
  const localStream = document.getElementById('localVideo').srcObject;
  const tracks = localStream.getAudioTracks();
  tracks.forEach(track => {
    track.enabled = !track.enabled;
  });
}
