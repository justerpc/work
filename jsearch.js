searchTool();

function searchTool() {
	// Function to sanitize and restore the original HTML
	function restoreOriginalHTML(element) {
		element.querySelectorAll('span.restore').forEach(node => {
		  const textNode = document.createTextNode(node.textContent);
		  node.parentNode.replaceChild(textNode, node);
		});
	}

	// Function to reset highlights and match counts
	function resetAll() {
		const elementsToExclude = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'A', 'H1', 'TITLE'];

		// Get all elements and then filter out the excluded ones
		const elementsToReset = Array.from(document.querySelectorAll('*')).filter(element => {
		  return !elementsToExclude.includes(element.nodeName);
		});

		// Iterate over each included element and restore the original HTML
		elementsToReset.forEach(element => {
		  restoreOriginalHTML(element);
		});

		// Remove match counts from the textarea lines
		const lines = textarea.value.split('\n');
		textarea.value = lines.map(line => {
		  return line.replace(/\(\d+\)$/g, '').trim();
		}).join('\n');
	}
	
	const wordsToRemove = ['terminate', 'anchor'];

    // Function to remove the specified words from the textarea
	function removeWordsFromTextarea(textarea, wordsArray) {
		const regex = new RegExp(`\\b(${wordsArray.join('|')})\\b`, 'ig');
		const lines = textarea.value.split('\n');

		const updatedLines = lines.map(line => {
			let words = line.split(/\s+/);
			if (words.length > 0) {
				// Check if the first word matches the specified conditions
				if (/^[a-zA-Z0-9]+[.,()\[\]]/.test(words[0])) {
					words.shift(); // Remove the first word
				}
			}
			// Remove words listed in wordsArray variable from the current line
			const updatedLine = words.join(' ').replace(regex, '');

			return updatedLine;
		});

		textarea.value = updatedLines.join('\n');
	}

	function removeSpacesFromLines(textarea) {
		const lines = textarea.value.split('\n');
		const formattedLines = lines.map(line => line.replace(/^\s+/, ''));
		textarea.value = formattedLines.join('\n');
	}
	
	// Function to remove spaces before and after each line in the textarea
	function trimLines(textarea) {
		const lines = textarea.value.split('\n');
		const formattedLines = lines.map(line => line.trim());
		textarea.value = formattedLines.join('\n');
	}

	// Create a container to hold the textarea and buttons
	const container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.bottom = '0';
	container.style.width = '100%';
	container.style.zIndex = '10000';
	container.style.backgroundColor = 'white';
	container.style.padding = '10px';
	container.style.boxSizing = 'border-box';
	container.style.display = 'none';

	// Create and style the textarea and button
	const textarea = document.createElement('textarea');
	textarea.style.display = 'block';
	textarea.style.width = '70%';
	textarea.style.margin = '10px auto';
	textarea.style.resize = 'vertical';
	textarea.style.minHeight = '20em';

	// Add 'input' event listener to call removeWordsFromTextarea and removeSpacesFromLines on user input
	textarea.addEventListener('input', () => {
		removeWordsFromTextarea(textarea, wordsToRemove);
		removeSpacesFromLines(textarea);
	});

	const button = document.createElement('button');
	button.textContent = 'Find Match';
	button.style.display = 'block';
	button.style.margin = '10px auto';

	// Append the elements to the container
	container.appendChild(textarea);
	container.appendChild(button);

	// Append the container to the webpage
	document.body.appendChild(container);

	// Define a function that highlights the matching text and counts matches per line
	function highlightMatchesAndCount(query) {
		const elementsToExclude = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'A', 'H1', 'TITLE'];

		const regexQuery = query.split('\n').map(line => ({
			regexCaseSensitive: new RegExp(`\\b${line}\\b`, 'g'), // Case sensitive
			regex: new RegExp(`\\b${line}\\b`, 'ig'), // Case insensitive
			count: 0
		}));

		// Get all <p> elements and then filter out the excluded ones
		const elements = Array.from(document.getElementsByTagName('p')).filter(element => {
			return !elementsToExclude.includes(element.nodeName);
		});

		elements.forEach(element => {
			if (element !== textarea) { // Exclude the textarea from processing
				restoreOriginalHTML(element);
			}

			for (const queryItem of regexQuery) {
				const spanNodes = element.querySelectorAll('p > span'); // Get <span> elements within the <p>

				// Iterate through span nodes only within the current element
				for (const spanNode of spanNodes) {
					if (spanNode.textContent.match(queryItem.regex)) {
						const matches = spanNode.textContent.match(queryItem.regex);
						queryItem.count += matches ? matches.length : 0;

						const replacementNode = document.createElement('span');

						const htmlText = spanNode.innerHTML.replace(queryItem.regex, match => {
							if (match.match(queryItem.regexCaseSensitive)) {
								return `<span class='restore' style='background-color: #32FF7E;'>${match}</span>`;
							} else {
								return `<span class='restore' style='background-color: #FFC048;'>${match}</span>`;
							}
						});

						replacementNode.innerHTML = htmlText;
						spanNode.replaceWith(replacementNode);
					}
				}

				// Process remaining text nodes in the element
				element.childNodes.forEach(childNode => {
					if (childNode.nodeType === 3 && childNode.textContent.match(queryItem.regex)) { // Only process text nodes
						const matches = childNode.textContent.match(queryItem.regex);
						queryItem.count += matches ? matches.length : 0;

						const replacementNode = document.createElement('span');

						const htmlText = childNode.textContent.replace(queryItem.regex, match => {
							if (match.match(queryItem.regexCaseSensitive)) {
								return `<span class='restore' style='background-color: #32FF7E;'>${match}</span>`;
							} else {
								return `<span class='restore' style='background-color: #FFC048;'>${match}</span>`;
							}
						});

						replacementNode.innerHTML = htmlText;
						element.replaceChild(replacementNode, childNode);
					}
				});
			}
		});

		return regexQuery;
	}

	// Display the match count for each line
	function updateMatchCount(queryResult) {
		const lines = textarea.value.split('\n');
		textarea.value = lines.map((line, index) => {
		  if(queryResult[index]) {
			return `${line} (${queryResult[index].count})`;
		  } else {
			return line;
		  }
		}).join('\n');
	}

	// Create a container to hold the search/open-close button
    const searchButtonContainer = document.createElement('div');
    searchButtonContainer.style.position = 'fixed';
    searchButtonContainer.style.bottom = '0';
    searchButtonContainer.style.right = '0';
    searchButtonContainer.style.zIndex = '10000';

    // Create and style the search/open-close button
    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.style.margin = '10px';

    // Append the search/open-close button to the container
    searchButtonContainer.appendChild(searchButton);

    // Append the search/open-close button container to the webpage
    document.body.appendChild(searchButtonContainer);

    // Toggle the visibility of the container with the textarea and "Find Match" button
    searchButton.addEventListener('click', () => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        searchButton.textContent = container.style.display === 'none' ? 'Search' : 'Close';
    });

	// Updated event listener for the "Find Match" button
	button.addEventListener('click', () => {
		rearrangeTextArea();
		
		trimLines(textarea)
		resetAll();

		const userInput = textarea.value.trim().replace(/\(\d+\)$/gm, '').trim();

		if(userInput) {
		  const queryResult = highlightMatchesAndCount(userInput);
		  updateMatchCount(queryResult);
		} else {
		  alert('Please enter a text to search');
		}
	});
	
	// Add event listener for keyboard input
	document.addEventListener('keydown', (event) => {
		if (event.ctrlKey && event.key === 'b') {   // Trigger the findMatch function when "ctrl" + "b" is pressed
			rearrangeTextArea();
			
			trimLines(textarea)
			resetAll();

			const userInput = textarea.value.trim().replace(/\(\d+\)$/gm, '').trim();

			if(userInput) {
			  const queryResult = highlightMatchesAndCount(userInput);
			  updateMatchCount(queryResult);
			} else {
			  alert('Please enter a text to search');
			}
		}
	});
	
	function reorderLinesDescending(text) {
		const linesArray = text.split('\n');
		const sortedLines = linesArray.sort((a, b) => b.length - a.length);
		return sortedLines.join('\n');
	}

	function rearrangeTextArea() {
		// Get the value from the textarea and trim it
		let userInput = textarea.value.trim().replace(/\(\d+\)$/gm, '').trim();

		if (userInput) {
			// Reorder the lines in the textarea starting from the highest to the lowest
			const reorderedInput = reorderLinesDescending(userInput);
			textarea.value = reorderedInput;
		}
	}
}
