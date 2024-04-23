/* * *   V E R S I O N   5 . 3 . 1   * * */

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
	
	assignTextArea(textAreaID) {
		let that = this;
		
		if(textAreaID === "pastetxt" || textAreaID === "pastetxtCodes" || textAreaID === "inputText") {
			// Get the textarea element
			this.textarea = document.getElementById(textAreaID);
		}
		else {
			const hostElement = document.querySelector('#draculaContainer');
			
			if(hostElement) {
				const shadowRoot = hostElement.shadowRoot;
				this.textarea = shadowRoot.querySelector('#inputText');
			}
		}
		
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
					
					// Check if the active text area element has an ID of pastetxtCodes
					if (that.textarea.id !== "pastetxtCodes") {
						lines[i] = removeSpecifiedPhrases(lines[i]);
						lines[i] = removeFirstWord(lines[i]);
					}
					else {
						lines[i] = removeFirstWordBrackets(lines[i]);
					}
					
					lines[i] = removeLastWord(lines[i]);
					
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
		}
	}
}

/* * * * * *   H E L P E R   F U N C T I O N S   * * * * */

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
		"show as header only if selected",
		"show as header",
		"thank and terminate",
		"if yes, thank and terminate"
	];
	
	// Remove bracketed phrases
	sentence = sentence.replace(/(<.*?>|{.*?}|\[.*?\])/g, "");
	
	// Remove hashtags-enclosed phrases
	let hashtagsPattern = /##.*?##/g;
	sentence = sentence.replace(hashtagsPattern, '');
	
	// Remove specified strings
	phrasesToRemove.forEach((str) => {
		sentence = sentence.replace(new RegExp(str + "\\s*\\S+", "gi"), "");
	});

	return sentence.split(/\s+/);
}

function removeFirstWord(words) {
	// Roman numerals from 2 to 50
	const romanNumerals = /^(II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|XXI|XXII|XXIII|XXIV|XXV|XXVI|XXVII|XXVIII|XXIX|XXX|XXXI|XXXII|XXXIII|XXXIV|XXXV|XXXVI|XXXVII|XXXVIII|XXXIX|XL|XLI|XLII|XLIII|XLIV|XLV|XLVI|XLVII|XLVIII|XLIX|L)$/i;
	// Check if the first word is a Roman numeral
	let isRomanNumeral = romanNumerals.test(words[0].toUpperCase());

	// Check if the first word starts with c or q or r or s followed by a number
	let isPrecode = /^[cqrs]\d+/i.test(words[0]);

	// Check if the first word contains an underscore or ends with punctuation
	let isEndWithPunctuation = /_/.test(words[0]) || (/[\]._(){}>)]$/.test(words[0]) && words[0].length <= 5);

	// Check if the first word starts with ( or [ or { or < and ends with ) or ] or } or >
	let isEnclosedByBrackets = /^[(|[{|<].*[)|]|}|>]$/.test(words[0]);

	// Check if the first word is a single character that isn't a number or letter
	let isSpecialChar = /^[^a-z0-9]{1}$/i.test(words[0]);

	// Remove the first word if it is a Roman numeral, satisfies isPrecode, isEndWithPunctuation, isEnclosedByBrackets or isSpecialChar conditions
	if (isRomanNumeral || isPrecode || isEndWithPunctuation || isEnclosedByBrackets || isSpecialChar) {
		words.splice(0, 1);
	}

	return removeWhitespaceElements(words);
}

function removeFirstWordBrackets(sentence) {
	sentence = sentence.split(/\s+/);
	
    if (sentence[0].length > 0 && /^[\[\(\<\{].*[\]\)\>\}]$/.test(sentence[0])) {
        // Replace opening and closing brackets from the first word
        sentence[0] = sentence[0].replace(/^[\[\(\<\{]/, '').replace(/[\]\)\>\}]$/, '');
    }
	
    return removeWhitespaceElements(sentence);
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
		"monitor",
		"locked",
		"lock"
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
    // Check if words is a string and convert it to an array by splitting into individual words or characters
    if (typeof words === 'string') {
        words = words.split(/\s+/);  // Split the string by whitespace to turn it into an array of words
    }

    // Check if words is now an array
    if (!Array.isArray(words)) {
        throw new TypeError("Expected an array or a string, but received " + typeof words);
    }

    // Filter the words using a callback function that returns true for strings that don't have only whitespaces
    const result = words.filter(function (str) {
        // Use regex to test if the current string contains only whitespaces
        return !/^\s*$/.test(str);
    });

    // Return the modified array
    return result;
}

/* * * * * *   h e l p e r   f u n c t i o n s   * * * * */

let purge = new Purge();

document.querySelector("body").addEventListener("keydown", function(event) {
	if(event.target.tagName.toLowerCase() === "textarea") {
		let activeTextareaId = event.target.id;
		
		purge.assignTextArea(activeTextareaId);
		purge.purgeTextArea();
	}
});

let hostElement = document.querySelector('#draculaContainer');

if(hostElement) {
	let shadowRoot = hostElement.shadowRoot;
	
	// Add event listener to the shadow root or directly to the textarea(s)
	shadowRoot.addEventListener('keydown', function(event) {
		if(event.target.tagName.toLowerCase() === "textarea") {
			let activeTextareaId = false;
			
			purge.assignTextArea(activeTextareaId);
			purge.purgeTextArea();
		}
	});
}
