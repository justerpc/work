jsearch();function jsearch(){const _0x9ed3x1=document["createElement"]('style');_0x9ed3x1["textContent"]= `
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
	`;document["head"]["appendChild"](_0x9ed3x1);const _0x9ed3x2=document["createElement"]("div");_0x9ed3x2["setAttribute"]("id","container");document["body"]["appendChild"](_0x9ed3x2);const _0x9ed3x3=document["createElement"]("div");_0x9ed3x3["setAttribute"]("id","inputWrapper");_0x9ed3x2["appendChild"](_0x9ed3x3);const _0x9ed3x4=document["createElement"]("textarea");_0x9ed3x4["setAttribute"]("id","inputText");_0x9ed3x4["setAttribute"]("placeholder","Enter your text here (one line per match)");_0x9ed3x3["appendChild"](_0x9ed3x4);const _0x9ed3x5=document["createElement"]("button");_0x9ed3x5["setAttribute"]("id","matchBtn");_0x9ed3x5["textContent"]= "Find Match";_0x9ed3x3["appendChild"](_0x9ed3x5);const _0x9ed3x6=document["createElement"]("table");_0x9ed3x6["setAttribute"]("id","outputTable");_0x9ed3x2["appendChild"](_0x9ed3x6);_0x9ed3x5["addEventListener"]('click',function(){const _0x9ed3x7=document["body"];const _0x9ed3x8=_0x9ed3x1a(_0x9ed3x7,_0x9ed3x2);const _0x9ed3x9=_0x9ed3x4["value"];const _0x9ed3xa=_0x9ed3x9["split"]('\x0A');const _0x9ed3xb={};const _0x9ed3xc={};_0x9ed3xa["forEach"]((_0x9ed3xd)=>{if(_0x9ed3xd["trim"]()!== ''){_0x9ed3xb[_0x9ed3xd["toLowerCase"]()]= 0;_0x9ed3xc[_0x9ed3xd]= 0}});_0x9ed3x8["forEach"]((_0x9ed3xe)=>{Object["keys"](_0x9ed3xb)["forEach"]((_0x9ed3xf)=>{const _0x9ed3xd=_0x9ed3xa["find"]((_0x9ed3x10)=>{return _0x9ed3x10["toLowerCase"]()=== _0x9ed3xf});if(_0x9ed3xe["toLowerCase"]()["includes"](_0x9ed3xf)){_0x9ed3xb[_0x9ed3xf]++;if(_0x9ed3xe["includes"](_0x9ed3xd)){_0x9ed3xc[_0x9ed3xd]++}}})});_0x9ed3x6["innerHTML"]= `<tr>
									<th>User Input</th>
									<th>Exact Match</th>
									<th>Case-Insensitive Match</th>
								  </tr>`;Object["keys"](_0x9ed3xb)["forEach"]((_0x9ed3xf)=>{const _0x9ed3xd=_0x9ed3xa["find"]((_0x9ed3x10)=>{return _0x9ed3x10["toLowerCase"]()=== _0x9ed3xf});if(_0x9ed3xd["trim"]()!== ''){let _0x9ed3x11='red';if(_0x9ed3xc[_0x9ed3xd]=== _0x9ed3xb[_0x9ed3xf]&& _0x9ed3xc[_0x9ed3xd]> 0){_0x9ed3x11= 'green'}else {if(_0x9ed3xc[_0x9ed3xd]!== _0x9ed3xb[_0x9ed3xf]&& (_0x9ed3xc[_0x9ed3xd]> 0|| _0x9ed3xb[_0x9ed3xf]> 0)){_0x9ed3x11= 'orange'}};const _0x9ed3x12=document["createElement"]('tr');_0x9ed3x12["setAttribute"]('class',_0x9ed3x11);const _0x9ed3x13=document["createElement"]('td');_0x9ed3x13["textContent"]= _0x9ed3xd;_0x9ed3x12["appendChild"](_0x9ed3x13);const _0x9ed3x14=document["createElement"]('td');_0x9ed3x14["textContent"]= _0x9ed3xc[_0x9ed3xd];_0x9ed3x12["appendChild"](_0x9ed3x14);const _0x9ed3x15=document["createElement"]('td');_0x9ed3x15["textContent"]= _0x9ed3xb[_0x9ed3xf];_0x9ed3x12["appendChild"](_0x9ed3x15);_0x9ed3x6["appendChild"](_0x9ed3x12)}})});const _0x9ed3x16=document["createElement"]("button");_0x9ed3x16["setAttribute"]("id","searchBtn");_0x9ed3x16["textContent"]= "Search";_0x9ed3x16["onclick"]= _0x9ed3x17;document["body"]["appendChild"](_0x9ed3x16);function _0x9ed3x17(){const _0x9ed3x18=window["getComputedStyle"](_0x9ed3x2);const _0x9ed3x19=_0x9ed3x18["getPropertyValue"]("display");_0x9ed3x2["style"]["display"]= _0x9ed3x19=== "none"?"flex":"none";_0x9ed3x16["textContent"]= _0x9ed3x19=== "none"?"Close":"Search"}function _0x9ed3x1a(_0x9ed3x7,_0x9ed3x1b){const _0x9ed3x1c=[];function _0x9ed3x1d(_0x9ed3x1e){for(let _0x9ed3x1f of _0x9ed3x1e["childNodes"]){if(_0x9ed3x1f!== _0x9ed3x1b){if(_0x9ed3x1f["nodeType"]=== Node["TEXT_NODE"]&& _0x9ed3x1f["textContent"]["trim"]()){_0x9ed3x1c["push"](_0x9ed3x1f["textContent"]["trim"]())}else {if(_0x9ed3x1f["nodeType"]=== Node["ELEMENT_NODE"]){_0x9ed3x1d(_0x9ed3x1f)}}}}}_0x9ed3x1d(_0x9ed3x7);return _0x9ed3x1c}function _0x9ed3x20(_0x9ed3x4){const _0x9ed3x21=_0x9ed3x4["value"]["split"]('\x0A');const _0x9ed3x22=_0x9ed3x21["map"]((_0x9ed3xd)=>{return _0x9ed3xd["replace"](/^\s+/,'')});_0x9ed3x4["value"]= _0x9ed3x22["join"]('\x0A')}function _0x9ed3x23(_0x9ed3x4,_0x9ed3x24){const _0x9ed3x25= new RegExp(`\\b(${_0x9ed3x24["join"]('|')})\\b`,'ig');const _0x9ed3x21=_0x9ed3x4["value"]["split"]('\x0A');const _0x9ed3x26=_0x9ed3x21["map"]((_0x9ed3xd)=>{let _0x9ed3x27=_0x9ed3xd["split"](/\s+/);if(_0x9ed3x27["length"]> 0){if(/^[a-zA-Z0-9]+[.,()\[\]]/["test"](_0x9ed3x27[0])){_0x9ed3x27["shift"]()}};const _0x9ed3x28=_0x9ed3x27["join"](' ')["replace"](_0x9ed3x25,'');return _0x9ed3x28});_0x9ed3x4["value"]= _0x9ed3x26["join"]('\x0A')}const _0x9ed3x29=['terminate','anchor'];_0x9ed3x4["addEventListener"]('input',()=>{_0x9ed3x23(_0x9ed3x4,_0x9ed3x29);_0x9ed3x20(_0x9ed3x4)});document["addEventListener"]('keydown',(_0x9ed3x2a)=>{if(_0x9ed3x2a["ctrlKey"]&& _0x9ed3x2a["key"]=== 'b'){const _0x9ed3x13=_0x9ed3x4["value"]["trim"]()["replace"](/\(\d+\)$/gm,'')["trim"]();if(_0x9ed3x13){_0x9ed3x5["click"]()}else {alert('Please enter a text to search')}}})}
