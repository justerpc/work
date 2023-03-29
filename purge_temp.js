/* * *   V E R S I O N   6   * * */

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
		this.purgeBtn.textContent = this.projName + " All";
		document.body.appendChild(this.purgeBtn);
		
		// Add onclick listener to the textarea
		this.purgeBtn.onclick = togglePurgeBtn;
		
		function togglePurgeBtn() {
			let purgeStatus = that.purgeBtn.textContent;
			that.purgeBtn.textContent = ((purgeStatus === "Purge Disabled") ? "Purge Enabled" : "Purge Disabled");
			
			if(purgeStatus == "Purge Disabled") {
				that.purgeBtn.textContent = "Purge All";
			}
			else if(purgeStatus == "Purge All") {
				that.purgeBtn.textContent = "Purge PN";
			}
			else {
				that.purgeBtn.textContent = "Purge Disabled";
			}
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
				if(that.purgeBtn.textContent !== "Purge Disabled") {
					// Clear any previous timeout
					clearTimeout(timeoutID);

					// Set a new timeout to execute the processing function after a delay of 500ms
					timeoutID = setTimeout(processText(that.purgeBtn.textContent), 500);
				}
			});

			function processText(mode) {
				// Get the current value of the textarea and split it into an array of lines
				let lines = that.textarea.value.split("\n");

				// Loop through each line and split it into an array of words using whitespace as delimiter
				for(let i = 0; i < lines.length; i++) {
					if(mode === "Purge All") {
						lines[i] = removeConsecutiveUnderscores(lines[i]);
						lines[i] = removeSpecifiedPhrases(lines[i]);
						lines[i] = removeFirstWord(lines[i]);
						lines[i] = removeLastWord(lines[i]);
					}
					else if(mode === "Purge PN") {
						lines[i] = removeConsecutiveUnderscores(lines[i]);
						lines[i] = removeSpecifiedPhrasesExclFirstWord(lines[i]);
						lines[i] = removeLastWord(lines[i]);
					}
					
					// Join the array elements back into a single string
					lines[i] = lines[i].join(" ");
				}

				// Join the lines back into a single string with each line separated by a newline character
				let processedText = lines.join("\n");

				// Replace any double spaces with single spaces
				let cleanedText = processedText.replace(/[\t ]{2,}/g, " ");

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
					"ask for",
					"removed in"
				];
				
				// Remove bracketed phrases
				sentence = sentence.replace(/(<.*?>|{.*?}|\[.*?\])/g, "");
				
				// Remove specified strings
				phrasesToRemove.forEach((str) => {
					sentence = sentence.replace(new RegExp(str + "\\s*\\S+", "gi"), "");
				});

				return sentence.split(/\s+/);
			}
			
			function removeSpecifiedPhrasesExclFirstWord(sentence) {
				// Define an array of strings to be removed
				let phrasesToRemove = [
					"pair together with",
					"group together with",
					"added in",
					"updated in",
					"ask for",
					"removed in"
				];

				// Split the sentence into an array of words
				let words = sentence.split(/\s+/);

				// Take the first word from the array and remove it for later use
				let firstWord = words.shift();

				// Create a new modified sentence without the first word
				let modifiedSentence = words.join(' ');

				// Remove bracketed phrases
				modifiedSentence = modifiedSentence.replace(/(<.*?>|{.*?}|\[.*?\])/g, "");

				// Remove specified strings
				phrasesToRemove.forEach((str) => {
					modifiedSentence = modifiedSentence.replace(new RegExp(str + "\\s*\\S+", "gi"), "");
				});

				// Combine the first word with the remaining modified sentence
				let finalSentence = `${firstWord} ${modifiedSentence}`;

				// Return the final sentence as an array of words
				return finalSentence.split(/\s+/);
			}

			function removeFirstWord(words) {	
				let isNonAlphabetic = words[0].length < 3 && /^[^a-zA-Z]*$/.test(words[0]) && words[0].charAt(0) != "$";
				let isSingleAlphabet = words[0].length < 2 && /^[a-zA-Z]{1}$/.test(words[0]) && !/^[ia]$/i.test(words[0]);
				let isBracketsAlphabet = words[0].length > 1 && words[0].length < 3 && ((/^[a-zA-Z]{1}$/.test(words[0].charAt(0)) && /^[.,<>{}\[\]\(\)]{1}$/.test(words[0].charAt(1))) || (/^[.,<>{}\[\]\(\)]{1}$/.test(words[0].charAt(0)) && /^[a-zA-Z]{1}$/.test(words[0].charAt(1)))) && !/^[ia]$/i.test(words[0]);
				let isBracketsNumeric = /^[\d<>\[\]{}()]+$/.test(words[0]);

				// Remove the first word if any of the conditions are true
				if (isNonAlphabetic || isSingleAlphabet || isBracketsAlphabet || isBracketsNumeric) {
					words.splice(0, 1);
				}
				
				return removeWhitespaceElements(words);
			}
			
			function removeLastWord(words) {
				// Define the words to remove
				let wordsToRemove = [
					"terminate",
					"term",
					"anchor",
					"shuffle",
					"exclusive",
					"fixed",
					"monitor"
				];

				// Get the last word from the words array
				let lastWord = words[words.length - 1];

				// Step 1: Remove the last word if it is enclosed in brackets
				if (/^[\[\]<>{].*[\}\]>]$/.test(lastWord)) {
					words.splice(words.length - 1, 1);
				}
				
				// Step 2: Remove the last word if it matches a word in wordsToRemove
				lastWord = words[words.length - 1];
				
				for (let j = 0; j < wordsToRemove.length; j++) {
					let word = wordsToRemove[j];

					// Match the exact word case-insensitively with word boundaries
					let regex = new RegExp("\\b" + word + "\\b", "i");


					// Test the last word with the regex
					if (regex.test(lastWord)) {
						// If the last word matches, remove it from the words array
						words.splice(words.length - 1, 1);
						break;
					}
				}
				
				return removeWhitespaceElements(words);
			}
			
			function removeWhitespaceElements(words) {
				// Filter the words using a callback function that returns true for strings that don't have only whitespaces
				let result = words.filter(function (str) {
					// Use regex to test if the current string contains only whitespaces
					// If the string contains any other character, the test returns false, and we keep it in the array
					return !/^\s*$/.test(str);
				});

				// Return the modified array
				return result;
			}
		}
	}
}

const purge = new Purge();
