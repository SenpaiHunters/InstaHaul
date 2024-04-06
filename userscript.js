// ==UserScript==
// @name         InstaHaul
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://instagram.com&size=256
// @version      1.5
// @license      MIT
// @author       Kami
// @description  A simple Instagram progress bar (darkmode has been removed)
// @match        *://www.instagram.com/*
// @exclude      *://www.instagram.com/stories/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/969665
// ==/UserScript==

///
/// THIS USERSCRIPT HAS BEEN ARCHIVED AND WILL NO LONGER BE UPDATED
///

///
/// IF THIS DOES NOT WORK, THEN IT WILL NOT BE FIXED
/// USE ANOTHER USERSCRIPT OR FIX THE ISSUES ON THIS
///


(function() {
    'use strict';

    const config = {
        progressbarHeight: 4.5, // in pixels
        progressbarColor: 'backdrop-filter: invert(70%);',
        progressbarElapsedColor: '#7c3aed'
    };

    // Inject progress bar styles into the document
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .instahaul-progressbar {
            position: absolute;
            opacity: .66;
            left: 0;
            right: 0;
            bottom: 0;
            height: ${config.progressbarHeight}px;
            background: ${config.progressbarColor};
            backdrop-filter: invert(100%);
        }
        .instahaul-progressbar-inner {
            width: 0;
            height: 100%;
            background: ${config.progressbarElapsedColor};
        }
    `;
    document.head.appendChild(styleElement);

    // Create and update progress bar for videos
    function createProgressBar(video) {
        const progressBar = document.createElement('div');
        progressBar.className = 'instahaul-progressbar';
        const innerBar = document.createElement('div');
        innerBar.className = 'instahaul-progressbar-inner';
        progressBar.appendChild(innerBar);
        video.parentNode.insertBefore(progressBar, video.nextSibling);
        return innerBar;
    }

    function updateProgressBar(video, innerBar) {
        const percentage = (video.currentTime / video.duration) * 100;
        innerBar.style.width = `${percentage}%`;
    }

    // Extend HTMLVideoElement to include progress bar functionality
    HTMLVideoElement.prototype.originalAddEventListener = HTMLVideoElement.prototype.addEventListener;
    HTMLVideoElement.prototype.addEventListener = function(type, listener, options) {
        if (type === 'play' && !this.hasAttribute('instahaul-initialized')) {
            this.setAttribute('instahaul-initialized', 'true');
            const innerBar = createProgressBar(this);
            const updateInterval = setInterval(() => updateProgressBar(this, innerBar), 100);
            this.originalAddEventListener('ended', () => clearInterval(updateInterval));
        }
        return this.originalAddEventListener(type, listener, options);
    };
})();