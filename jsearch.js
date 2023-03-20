jsearch();

function jsearch() {
	// Create and add CSS styles to the page
	const style = document.createElement('style');
	style.textContent = `
		#searchBtn {
			position: fixed;
			bottom: 0;
			right: 0;
			margin: 1em;
			z-index: 10000;
		}
		#container {
			display: none;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #f2f2f2;
			padding: 20px;
			z-index: 9999;
			font-family: Arial, Helvetica, sans-serif;
		}
		#inputWrapper {
			display: flex;
			flex-direction: column;
			width: 100%;
			gap: 10px;
		}
		#inputText {
			height: 15em;
			width: 100%;
			margin: 10px 0;
			padding: 5px;
			font-size: 16px;
			border: none;
			border-radius: 3px;
			box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
		}
		#matchBtn {
			background-color: #007bff;
			border: none;
			color: #fff;
			font-size: 16px;
			padding: 5px 10px;
			margin-bottom: 1em;
			border-radius: 3px;
			cursor: pointer;
		}
		#matchBtn:hover {
			background-color: #0069d9;
		}
		#outputTable {
			border-collapse: collapse;
			width: 100%;
			margin: 1em;
		}
		#outputTable,
		#outputTable th,
		#outputTable td {
			border: 1px solid black;
			padding: 8px;
			text-align: left;
		}
		#outputTable th {
			background-color: #f2f2f2;
			font-weight: bold;
		}
		.green {
			background-color: #32FF7E;
		}
		.orange {
			background-color: #FFC048;
		}
		.red {
			background-color: #FF7979;
		}
	`;

	document.head.appendChild(style);

	// Create and add the container
	const container = document.createElement("div");
	container.setAttribute("id", "container");
	document.body.appendChild(container);

	// Create and add the input wrapper
	const inputWrapper = document.createElement("div");
	inputWrapper.setAttribute("id", "inputWrapper");
	container.appendChild(inputWrapper);

	// Create and add the text area
	const inputText = document.createElement("textarea");
	inputText.setAttribute("id", "inputText");
	inputText.setAttribute("placeholder", "Enter your text here (one line per match)");
	inputWrapper.appendChild(inputText);

	// Create and add the 'Find Match' button
	const matchBtn = document.createElement("button");
	matchBtn.setAttribute("id", "matchBtn");
	matchBtn.textContent = "Find Match";
	inputWrapper.appendChild(matchBtn);

	// Create and add the output table
	const outputTable = document.createElement("table");
	outputTable.setAttribute("id", "outputTable");
	container.appendChild(outputTable);

	// Listener wrapping the extractTextFromHTML() function and binding it to the 'Find Match' button
	matchBtn.addEventListener('click', function(){
		trimLines(inputText);

		const parentElement = document.body;
		const textArray = extractTextFromHTML(parentElement, container);

		const inputTextValue = inputText.value;
		const inputLines = inputTextValue.split('\n');

		const matchCount = {};
		const caseSensitiveMatchCount = {};
		inputLines.forEach(line => {
			if (line.trim() !== '') {
				matchCount[line.toLowerCase()] = 0;
				caseSensitiveMatchCount[line] = 0;
			}
		});

		// Regex to match start/end of string or a non-alphanumeric character
		const wordBoundary = /(^|\W)$1(\W|$)/;

		textArray.forEach(text => {
			Object.keys(matchCount).forEach(lineLower => {
				const line = inputLines.find(item => item.toLowerCase() === lineLower);

				// Check if the lowercase line occurs surrounded by non-alphanumeric characters or the start/end of the string
				const lineLowerRegex = new RegExp(`(^|\\W)${lineLower}(\\W|$)`, 'gi');
				const lineLowerMatches = text.toLowerCase().match(lineLowerRegex);

				// Check if the original case line occurs surrounded by non-alphanumeric characters or the start/end of the string
				const lineRegex = new RegExp(`(^|\\W)${line}(\\W|$)`, 'g');
				const lineMatches = text.match(lineRegex);

				// Increase count for each complete word match found
				if (lineLowerMatches) matchCount[lineLower] += lineLowerMatches.length;
				if (lineMatches) caseSensitiveMatchCount[line] += lineMatches.length;
			});
		});

		outputTable.innerHTML = `<tr>
									<th>User Input</th>
									<th>Exact Match</th>
									<th>Case-Insensitive Match</th>
								  </tr>`;

		Object.keys(matchCount).forEach(lineLower => {
			const line = inputLines.find(item => item.toLowerCase() === lineLower);
			if (line.trim() !== '') {

				let rowClass = 'red';
				if (caseSensitiveMatchCount[line] === matchCount[lineLower] && caseSensitiveMatchCount[line] > 0) {
					rowClass = 'green';
				} else if (caseSensitiveMatchCount[line] !== matchCount[lineLower] && (caseSensitiveMatchCount[line] > 0 || matchCount[lineLower] > 0)) {
					rowClass = 'orange';
				}

				const resultRow = document.createElement('tr');
				resultRow.setAttribute('class', rowClass);

				const userInput = document.createElement('td');
				userInput.textContent = line;
				resultRow.appendChild(userInput);

				const exactMatch = document.createElement('td');
				exactMatch.textContent = caseSensitiveMatchCount[line];
				resultRow.appendChild(exactMatch);

				const insensitiveMatch = document.createElement('td');
				insensitiveMatch.textContent = matchCount[lineLower];
				resultRow.appendChild(insensitiveMatch);

				outputTable.appendChild(resultRow);
			}
		});
	});

	// Show/hide the container when the search button is clicked
	const searchBtn = document.createElement("button");
	searchBtn.setAttribute("id", "searchBtn");
	searchBtn.textContent = "Search";
	searchBtn.onclick = toggleContainer;
	document.body.appendChild(searchBtn);

	function toggleContainer() {
		const containerStyle = window.getComputedStyle(container);
		const displayValue = containerStyle.getPropertyValue("display");
		container.style.display = displayValue === "none" ? "flex" : "none";
		searchBtn.textContent = displayValue === "none" ? "Close" : "Search";
	}

	// The updated extractTextFromHTML() function
	function extractTextFromHTML(parentElement, excludedElement) {
		const textValues = [];

		function getTextRecursively(element) {
			for (let node of element.childNodes) {
				// Skip the excluded element (container)
				if (node !== excludedElement) {
					if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
						textValues.push(node.textContent.trim());
					} else if (node.nodeType === Node.ELEMENT_NODE) {
						getTextRecursively(node);
					}
				}
			}
		}

		getTextRecursively(parentElement);

		return textValues;
	}
	
	// Function to remove spaces before and after each line in the textarea
	function trimLines(inputText) {
		const lines = inputText.value.split('\n');
		const formattedLines = lines.map(line => line.trim());
		inputText.value = formattedLines.join('\n');
	}

	// Function to remove spaces before and after each line in the textarea
	function removeSpaceBeforeLines(inputText) {
		const lines = inputText.value.split('\n');
		const formattedLines = lines.map(line => line.replace(/^\s+/, ''));
		inputText.value = formattedLines.join('\n');
	}

	// Function to remove the specified words from the textarea
	function removeWordsFromTextarea(inputText, wordsArray) {
		const regex = new RegExp(`\\b(${wordsArray.join('|')})\\b`, 'ig');
		const lines = inputText.value.split('\n');

		const updatedLines = lines.map(line => {
			let words = line.split(/\s+/);
			if (words.length > 0) {
				// Check if the first word matches the specified conditions
				if (/^[a-zA-Z0-9]+[.,()\[\]]/.test(words[0]) && words[0].length <= 3) {
					words.shift(); // Remove the first word
				}
			}
			// Remove words listed in wordsArray variable from the current line
			const updatedLine = words.join(' ').replace(regex, '');

			return updatedLine;
		});

		inputText.value = updatedLines.join('\n');
	}

	const wordsToRemove = ['terminate', 'anchor'];

	// Add 'input' event listener to call removeWordsFromTextarea and removeSpaceBeforeLines on user input
	inputText.addEventListener('input', () => {
		removeWordsFromTextarea(inputText, wordsToRemove);
		removeSpaceBeforeLines(inputText);
	});

	// Add event listener for keyboard input
	document.addEventListener('keydown', (event) => {
		if (event.ctrlKey && event.key === 'b') {   // Trigger the findMatch function when "ctrl" + "b" is pressed
			const userInput = inputText.value.trim().replace(/\(\d+\)$/gm, '').trim();

			if(userInput) {
			  matchBtn.click();
			} else {
			  alert('Please enter a text to search');
			}
		}
	});	
}
