/* * * V E R S I O N   3 * * */

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
		
		// Add Strip button to the web page
		this.purgeBtn = document.createElement("button");
		this.purgeBtn.setAttribute("id", "purgeBtn");
		this.purgeBtn.textContent = this.projName + " Enabled";
		document.body.appendChild(this.purgeBtn);
	}
	
	assignTextArea() {
		let that = this;
		
		// Get the textarea element
		this.textarea = document.getElementById('pastetxt');
		
		if(this.textarea) {
			this.isAssigned = true;
			
			// Add onclick listener to the textarea
			this.purgeBtn.onclick = toggleStripBtn;
			
			function toggleStripBtn() {
				let purgeStatus = that.purgeBtn.textContent;
				that.purgeBtn.textContent = ((purgeStatus === "Purge Disabled") ? "Purge Enabled" : "Purge Disabled");
			}
		}
	}
	
	purgeTextArea() {
		let that = this;

		// Check if the target textarea exists
		if(this.isAssigned) {
			// Define the words to remove
			let wordsToRemove = ['terminate', 'term', 'anchor', 'shuffle', 'exclusive'];

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

				// Loop through each line and split it into an array of words
				for(let i = 0; i < lines.length; i++) {
					lines[i] = lines[i].split(' ');
				}

				// Loop through each line and remove bullet/number lists labels from the start of the line
				for(let i = 0; i < lines.length; i++) {
					if(/\d+\./.test(lines[i][0]) || /[*\-+]/.test(lines[i][0])) {
						lines[i].splice(0, 1);
					}
				}

				// Loop through each line and remove the first word if enclosed in brackets
				for(let i = 0; i < lines.length; i++) {
					if(/^[({\[\]})]/.test(lines[i][0])) {
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

const purge = new Purge();
