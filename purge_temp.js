/* * *   V E R S I O N   5 . 3 . 0   * * */

class Purge {
    constructor() {
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
        
        this.purgeBtn = document.createElement("button");
        this.purgeBtn.id = "purgeBtn";
        this.purgeBtn.textContent = `${this.projName} Enabled`;
        document.body.appendChild(this.purgeBtn);
        
        this.purgeBtn.onclick = () => {
            this.purgeBtn.textContent = this.purgeBtn.textContent.includes("Enabled") ? "Purge Disabled" : "Purge Enabled";
        };
    }
    
    assignTextArea(textAreaID) {
        if (["pastetxt", "pastetxtCodes", "inputText"].includes(textAreaID)) {
            this.textarea = document.getElementById(textAreaID);
        } else {
            const hostElement = document.querySelector('#draculaContainer');
            if (hostElement && hostElement.shadowRoot) {
                this.textarea = hostElement.shadowRoot.querySelector('#inputText');
            }
        }
        
        this.isAssigned = !!this.textarea;
    }
    
    purgeTextArea() {
        if (this.isAssigned && this.textarea) {
            let timeoutID = null;

            this.textarea.addEventListener("input", () => {
                if (this.purgeBtn.textContent.includes("Enabled")) {
                    clearTimeout(timeoutID);
                    timeoutID = setTimeout(() => this.processText(), 500);
                }
            });
        }
    }

    processText() {
        let lines = this.textarea.value.split("\n");
		
        lines = lines.map(line => {
            let words = line.split(/\s+/);
			
            words = removeConsecutiveUnderscores(words);
            
            if (this.textarea.id === "pastetxtCodes") {
                words = removeFirstWordBrackets(words);
            } else {
				words = removeSpecifiedPhrases(words);
                words = removeFirstWord(words);
            }
			
            words = removeLastWord(words);
			
            return words.join(" ");
        });
		
        this.textarea.value = lines.join("\n").replace(/[\t ]{2,}/g, " ");
    }
}

// Helper functions
function removeConsecutiveUnderscores(words) {
    return words.replace(/\s*_{2,}\s*/g, '');
}

function removeSpecifiedPhrases(words) {
    const phrasesToRemove = [
        "pair together with", 
		"group together with", 
		"show as header only if selected",
        "show as header", 
		"thank and terminate", 
		"if yes, thank and terminate"
    ];
	
    let result = words.filter(word => !phrasesToRemove.includes(word));
	
    return result;
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

function removeFirstWordBrackets(words) {
    if (words.length > 0 && /^[\[\(\<\{].*[\]\)\>\}]$/.test(words[0])) {
        // Replace opening and closing brackets from the first word
        words[0] = words[0].replace(/^[\[\(\<\{]/, '').replace(/[\]\)\>\}]$/, '');
    }
	
    return words;
}

function removeLastWord(words) {
    if (words.length > 0 && words[words.length - 1].match(/termination|term$/)) {
        words.pop();
    }
	
    return words;
}

// Now, setting up the actual usage of the class
let purge = new Purge();

document.body.addEventListener("keydown", event => {
    if (event.target.tagName.toLowerCase() === "textarea") {
        purge.assignTextArea(event.target.id);
        purge.purgeTextArea();
    }
});

let hostElement = document.querySelector('#draculaContainer');

if (hostElement && hostElement.shadowRoot) {
    hostElement.shadowRoot.addEventListener('keydown', event => {
        if (event.target.tagName.toLowerCase() === "textarea") {
            purge.assignTextArea(false);
            purge.purgeTextArea();
        }
    });
}
