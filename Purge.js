/* * *   V E R S I O N   5 . 1   * * */

document.querySelector("body").addEventListener("keydown", function(event) {
	if(event.target.tagName.toLowerCase() === "textarea" && purge.isAssigned) {
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
		this.purgeStyle = document.createElement("style");
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
		this.textarea = document.getElementById("pastetxt");
		
		if(this.textarea) {
			this.isAssigned = true;
		}
	}
	
	purgeTextArea() {
		let that = this;

		// Check if the target textarea exists
		if(this.isAssigned) {
			let timeoutID = null;

			// Add an event listener for the "input" event
			this.textarea.addEventListener("input", function(event) {
				if(that.purgeBtn.textContent === "Purge Enabled") {
					// Clear any previous timeout
					clearTimeout(timeoutID);

					// Set a new timeout to execute the processing function after a delay of 500ms
					timeoutID = setTimeout(processText(), 500);
				}
			});

			function processText() {
				// Get the current value of the textarea and split it into an array of lines
				let lines = that.textarea.value.split("\n");

				// Loop through each line and split it into an array of words using whitespace as delimiter
				for(let i = 0; i < lines.length; i++) {
					lines[i] = removeConsecutiveUnderscores(lines[i]);
					lines[i] = removeSpecifiedPhrases(lines[i]);
					lines[i] = removeFirstWord(lines[i]);
					lines[i] = removeLastWord(lines[i]);
					lines[i] = removeSpecifiedWords(lines[i]);
					
					// Join the array elements back into a single string
					lines[i] = lines[i].join(" ");
				}

				// Join the lines back into a single string with each line separated by a newline character
				const processedText = lines.join("\n");

				// Replace any double spaces with single spaces
				const cleanedText = processedText.replace(/[\t ]{2,}/g, " ");

				// Set the updated text as the new value of the textarea
				that.textarea.value = cleanedText;
			}
			
			function removeConsecutiveUnderscores(words) {
				// Use regular expression to match consecutive underscores (at least two) with optional surrounding whitespace
				let regex = /\s*_{2,}\s*/g;

				// Replace the matched pattern with an empty string and return the result
				return words.replace(regex, '');
			}
			
			function removeSpecifiedPhrases(sentence) {
				// Define an array of strings to be removed
				let phrasesToRemove = [
					"pair together with",
					"group together with",
					"added in",
					"updated in",
					"ask for"
				];
				
				// Remove bracketed phrases
				sentence = sentence.replace(/(<.*?>|{.*?}|\[.*?\])/g, "");
				
				// Remove specified strings
				phrasesToRemove.forEach((str) => {
					sentence = sentence.replace(new RegExp(str + "\\s*\\S+", "gi"), "");
				});

				return sentence.split(/\s+/);
			}
			
			function removeFirstWord(words) {	
				let isNonAlphabetic = /^[^a-zA-Z]*$/.test(words[0]) && words[0].charAt(0) != "$";
				let isSingleAlphabet = words[0].length < 3 && (/^[a-zA-Z]{1}$/.test(words[0].charAt(0)) || /^[a-zA-Z]{1}$/.test(words[0].charAt(1)) || /^[.,<>{}\[\]\(\)]{1}$/.test(words[0].charAt(0)) || /^[.,<>{}\[\]\(\)]{1}$/.test(words[0].charAt(1))) && !/^[ia]$/i.test(words[0]);
				let isBracketsNumeric = /^[\d<>\[\]{}()]+$/.test(words[0]);

				// Remove the first word if any of the conditions are true
				if (isNonAlphabetic || isSingleAlphabet || isBracketsNumeric) {
					words.splice(0, 1);
				}
				
				return words;
			}
			
			function removeLastWord(words) {
				let lastWord = words[words.length - 1];

				if(/^[\[\]<>{].*[\}\]>]$/.test(lastWord)) {
					words.splice(words.length - 1, 1);
				}
				
				return words;
			}
			
			function removeSpecifiedWords(words) {
				// Define the words to remove
				let wordsToRemove = [
					"terminate",
					"term",
					"anchor",
					"shuffle",
					"exclusive",
					"fixed"
				];

				for(let j = 0; j < wordsToRemove.length; j++) {
					let word = wordsToRemove[j];

					// match the exact word case-insensitively
					let regex = new RegExp("\\b" + word + "\\b", "i");

					// Use Array.prototype.indexOf() to find the index of the exact word instead of string.search() to correctly handle special characters
					let index = words.findIndex((element) => regex.test(element));

					if(index >= 0) {
						// If the word is found, remove it from the line
						words.splice(index, 1);
					}
				}
				
				return words;
			}
		}
	}
}

const purge = new Purge();
