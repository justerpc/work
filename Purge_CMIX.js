/* * *   V E R S I O N   1   * * */

document.querySelector('body').addEventListener('keydown', function(event) {
	if(event.target.tagName.toLowerCase() === 'textarea' && purge.isAssigned) {
		purge.purgeTextArea();
	}
	else {
		purge.assignTextArea();
		purge.purgeTextArea();
	}
});

class Purge {
	constructor() {
		let that = this;
		
		// Create and add CSS styles to the page
		this.purgeStyle = document.createElement('style');
		this.projName = "Purge";
		this.isAssigned = false;
		
		this.purgeStyle.textContent = `
			#purgeBtn {
				position: fixed;
				bottom: 0;
				left: 0;
				margin: 1em;
				z-index: 10000;
			}
		`;
		
		document.head.appendChild(this.purgeStyle);
		
		// Add Purge button to the web page
		this.purgeBtn = document.createElement("button");
		this.purgeBtn.setAttribute("id", "purgeBtn");
		this.purgeBtn.textContent = this.projName + " Enabled";
		document.body.appendChild(this.purgeBtn);
		
		// Add onclick listener to the textarea
		this.purgeBtn.onclick = togglePurgeBtn;
		
		function togglePurgeBtn() {
			let purgeStatus = that.purgeBtn.textContent;
			that.purgeBtn.textContent = ((purgeStatus === "Purge Disabled") ? "Purge Enabled" : "Purge Disabled");
		}
	}
	
	assignTextArea() {
		// Get the textarea element
		this.textarea = document.getElementById('pastetxt');
		
		if(this.textarea) {
			this.isAssigned = true;
		}
	}
	
	purgeTextArea() {
		let that = this;

		// Check if the target textarea exists
		if(this.isAssigned) {
			// Define the words to remove
			let wordsToRemove = ['terminate', 'term', 'anchor', 'shuffle', 'exclusive', 'fixed'];

			let timeoutID = null;

			// Add an event listener for the "input" event
			this.textarea.addEventListener('input', function(event) {
				if(that.purgeBtn.textContent === "Purge Enabled") {
					// Clear any previous timeout
					clearTimeout(timeoutID);

					// Set a new timeout to execute the processing function after a delay of 500ms
					timeoutID = setTimeout(processText(), 500);
				}
			});

			function processText() {
				// Get the current value of the textarea and split it into an array of lines
				let lines = that.textarea.value.split('\n');

				// Loop through each line and split it into an array of words using whitespace as delimiter
				for(let i = 0; i < lines.length; i++) {
					lines[i] = lines[i].split(/\s+/);
				}

				// Loop through each line and remove the first word if it doesn't contain alphabetic characters or is a non-'I' and non-'i' single alphabetic character
				for(let i = 0; i < lines.length; i++) {
					const isNonAlphabetic = /^[^a-zA-Z]*$/.test(lines[i][0]);
					const isSingleAlphabet = /^[a-zA-Z]{1}$/.test(lines[i][0]) && !/^i$/i.test(lines[i][0]);
					const isBracketsNumeric = /^[\d<>\[\]{}()]+$/.test(lines[i][0]);

					// Remove the first word if any of the conditions are true
					if (isNonAlphabetic || isSingleAlphabet || isBracketsNumeric) {
						lines[i].splice(0, 1);
					}
				}

				// Loop through each line and remove the last word if enclosed in curly brackets, angled brackets or square brackets
				for(let i = 0; i < lines.length; i++) {
					let lastWord = lines[i][lines[i].length - 1];

					if(/^[\[\]<>{].*[\}\]>]$/.test(lastWord)) {
						lines[i].splice(lines[i].length - 1, 1);
					}
				}

				// Loop through each line and remove the specified words
				for(let i = 0; i < lines.length; i++) {
					for(let j = 0; j < wordsToRemove.length; j++) {
						const word = wordsToRemove[j];

						// match the exact word case-insensitively
						const regex = new RegExp('\\b' + word + '\\b', 'i');

						// Use Array.prototype.indexOf() to find the index of the exact word instead of string.search() to correctly handle special characters
						const index = lines[i].findIndex((element) => regex.test(element));

						if(index >= 0) {
							// If the word is found, remove it from the line
							lines[i].splice(index, 1);
						}
					}
				}

				// Loop through each line and remove consecutive underscores forming a line
				for(let i = 0; i < lines.length; i++) {
					lines[i] = lines[i].map(word => word.replace(/_{2,}/g, ''));
				}

				// Loop through each line and remove "pair together with" or "group together with" and the next word after it
				for(let i = 0; i < lines.length; i++) {
					let line = lines[i].join(" ");
					line = line.replace(/pair together with\s*\S+/gi, "");
					line = line.replace(/group together with\s*\S+/gi, "");
					lines[i] = line.split(" ");
				}

				// Loop through each line and join the array elements back into a single string
				for(let i = 0; i < lines.length; i++) {
					lines[i] = lines[i].join(' ');
				}

				// Join the lines back into a single string with each line separated by a newline character
				const processedText = lines.join('\n');

				// Replace any double spaces with single spaces
				const cleanedText = processedText.replace(/[\t ]{2,}/g, ' ');

				// Set the updated text as the new value of the textarea
				that.textarea.value = cleanedText;
			}
		}
	}
}

class Canvas {
	constructor() {
		let that = this;
		
		// Create and add CSS styles to the page
		this.style = document.createElement('style');
		this.projName = "Canvas";
		
		this.style.textContent = `
			#canvasBtn {
				position: fixed;
				bottom: 0;
				right: 0;
				margin: 1em;
				z-index: 10000;
			}
			
			#canvas {
				display: none;
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				background-color: #f2f2f2;
				padding: 20px;
				max-height: 40vh;
				overflow-y: auto;
				z-index: 9999;
				font-family: Arial, Helvetica, sans-serif;
			}
			
			#inputWrapper {
				display: block;
				width: 100%;
				gap: 10px;
			}
			
			#inputText {
				width: 100%;
				margin: 10px 0;
				padding: 5px;
				font-size: 16px;
				border: none;
				border-radius: 3px;
				box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
			}
		`;

		document.head.appendChild(this.style);
		
		// Create and add the container
		this.canvas = document.createElement("div");
		this.canvas.setAttribute("id", "canvas");
		document.body.appendChild(this.canvas);
		
		// Show or hide the container when the canvas button is clicked
		this.canvasBtn = document.createElement("button");
		this.canvasBtn.setAttribute("id", "canvasBtn");
		this.canvasBtn.textContent = this.projName;
		this.canvasBtn.onclick = toggleCanvas;
		document.body.appendChild(this.canvasBtn);

		function toggleCanvas() {
			let canvasStyle = window.getComputedStyle(that.canvas);
			let displayValue = canvasStyle.getPropertyValue("display");
			
			that.canvas.style.display = displayValue === "none" ? "flex" : "none";
			that.canvasBtn.textContent = displayValue === "none" ? "Close" : that.projName;
		}
		
		// Create and add the input wrapper
		this.inputWrapper = document.createElement("div");
		this.inputWrapper.setAttribute("id", "inputWrapper");
		this.canvas.appendChild(this.inputWrapper);

		// Create and add the text area
		this.inputText = document.createElement("textarea");
		this.inputText.setAttribute("id", "pastetxt");
		this.inputText.setAttribute("rows", "10em");
		this.inputText.setAttribute("placeholder", "Enter your text here (one line per match)");
		this.inputWrapper.appendChild(this.inputText);
	}
}

const canvas = new Canvas();
const purge = new Purge();
