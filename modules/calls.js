// ============================================================
//  calls.js — WebRTC call buttons & initialization
// ============================================================

function initializeWebRTCManagers() {
    return new Promise((resolve) => {
        console.log('🔄 Initializing WebRTC managers...');

        const checkManagers = () => {
            if (typeof window.webRTCManager !== 'undefined' &&
                typeof window.signalingManager !== 'undefined') {

                webRTCManager    = window.webRTCManager;
                signalingManager = window.signalingManager;

                console.log('✅ WebRTC managers loaded');

                if (signalingManager && typeof signalingManager.initialize === 'function') {
                    signalingManager.initialize();
                    console.log('🎉 WebRTC system ready');
                }
                resolve();
            } else {
                setTimeout(checkManagers, 200);
            }
        };

        checkManagers();
        setTimeout(() => {
            console.log('⚠️ WebRTC managers loading timeout');
            resolve();
        }, 10000);
    });
}

function addCallButtonsToChat() {
    document.querySelectorAll('.call-buttons').forEach(b => b.remove());

    const activeContainer = chatWithUID
        ? document.getElementById('individualChat')
        : document.getElementById('groupChatContainer');
    const chatHeader = activeContainer?.querySelector('.chat-header');

    if (!chatHeader || (!chatWithUID && !groupChatID)) return;

    const callButtons = document.createElement('div');
    callButtons.className = 'call-buttons';

    if (chatWithUID) {
        callButtons.innerHTML = `
            <button class="chat-call-btn voice-call" title="Voice Call">📞</button>
            <button class="chat-call-btn video-call" title="Video Call">📹</button>
        `;
        callButtons.querySelector('.voice-call').addEventListener('click', startVoiceCall);
        callButtons.querySelector('.video-call').addEventListener('click', startVideoCall);
    } else if (groupChatID) {
        callButtons.innerHTML = `
            <button class="chat-call-btn group-call" title="Group Call (Coming Soon)" disabled>👥</button>
        `;
    }

    chatHeader.appendChild(callButtons);
}

async function startVoiceCall() {
    if (!webRTCManager) {
        modalManager.showModal('Error', 'Call system not initialized. Please refresh the page.', 'error');
        return;
    }
    if (!chatWithUID) {
        modalManager.showModal('Info', 'Please select a chat to start a call', 'info');
        return;
    }
    try {
        await webRTCManager.startCall(chatWithUID, false);
    } catch (error) {
        console.error('Failed to start voice call:', error);
        modalManager.showModal('Error', 'Failed to start voice call: ' + error.message, 'error');
    }
}

async function startVideoCall() {
    if (!webRTCManager) {
        modalManager.showModal('Error', 'Call system not initialized. Please refresh the page.', 'error');
        return;
    }
    if (!chatWithUID) {
        modalManager.showModal('Info', 'Please select a chat to start a call', 'info');
        return;
    }
    try {
        await webRTCManager.startCall(chatWithUID, true);
    } catch (error) {
        console.error('Failed to start video call:', error);
        modalManager.showModal('Error', 'Failed to start video call: ' + error.message, 'error');
    }
}

window.initializeWebRTCManagers = initializeWebRTCManagers;
window.addCallButtonsToChat     = addCallButtonsToChat;
window.startVoiceCall           = startVoiceCall;
window.startVideoCall           = startVideoCall;

console.log('calls.js loaded');
