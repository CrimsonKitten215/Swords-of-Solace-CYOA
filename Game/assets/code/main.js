const COLOURS = ["lemon", "saffron", "orange", "cinnabar", "scarlet", "crimson", "magenta", "fuchsia", "amethyst", "indigo", "navy", "cobalt", "cyan", "teal", "emerald", "lime"];
const COLOUR_INDEX = COLOURS.reduce((m, c, i) => (m[c] = i, m), Object.create(null));
const COLOUR_SHARES = {
	lemon: [4, 4, 0], saffron: [4, 3, 0], orange: [4, 2, 0],
	cinnabar: [4, 1, 0], scarlet: [4, 0, 0], crimson: [4, 0, 1],
	magenta: [4, 0, 2], fuchsia: [4, 0, 3], amethyst: [3, 0, 4],
	indigo: [2, 1, 4], navy: [1, 1, 4], cobalt: [0, 1, 3],
	cyan: [0, 3, 4], teal: [0, 4, 3], emerald: [0, 4, 1], lime: [2, 4, 0]
};
const g_alphabet = [
	"ĀĂĄȀȂȦÀÁÃÄÅǍǞǠǺȺӐӒΆἈἉἊἋἌἍἎἏᾈᾉᾊᾋᾌᾍᾎᾏᾸᾹᾺΆᾼ",
	"ƁɃḂḄḆ",
	"ĆĈƇÇĊČḈ",
	"ĐƉĎƊḊḌḎḐḒ",
	"ĒĔĖĘȄȆȨɆÈÉÊËĚ",
	"ƑḞ",
	"ĠĢƓĜĞǤǦǴḠ",
	"ĤĦȞḢḤḦḨḪⱧꞪＨ",
	"ĨİƗȈÌÍÎÏĪĬĮǏȊ",
	"JĴ",
	"ĶƘǨḰḲḴⱩꝂꝄꞢ",
	"ĹŁĽĻĿḶḸḺḼⱠⱢꝆꝈ",
	"ḾṀṂⱮ",
	"ŃŅŇÑƝǸṄṆṈṊꞤꞐ",
	"ŐȰÒÓÔÕÖØŌŎƟƠǑǪǬǾȌȎȪȬȮӦӨӪ",
	"ƤṔṖⱣꝐꝒꝔ",
	"ɊꝘꝖ",
	"ŔŖŘȐȒɌṘṚṜⱤṞꞦ",
	"ŠȘŚŜŞṤṢṠṦṨⱾꞨ",
	"ŢŤƬƮȚȾṪṬṮṰ",
	"ŨŰȔŲɄȖÙÚÛÜŪŬŮƯǓǕǗǙǛ",
	"ṼṾ",
	"ŴẀẂẄẆẈⱲ",
	"ẊẌ",
	"ŶŸȲÝƳɎẎỲỴỶỸ",
	"ŹȤŻŽƵẐẒẔⱿⱫ",
	"āăąȁȃȧàáâãäåǎǟǡǻӑӓ",
	"ƀƃɓᵬḃḅḇ",
	"ćĉƈɕↄçċčȼḉꞓ",
	"đȡɖɗƌďᵭḋḍḏḑḓ",
	"ēĕėęȅȇȩɇèéêëě",
	"ƒᵮḟ",
	"ġģɠĝğǥǧǵḡꞡ",
	"ĥħɦȟḣḥḧḩḫẖⱨ",
	"ĩıȉɨìíîïīĭįǐȋ",
	"ĵɉĵǰɟʝ",
	"ķƙǩḱḳⱪḵꞣ",
	"ŀłȴļľƚɫɬᶅḹḻḽꞎ",
	"ɱᵯḿṁṃ",
	"ńņňŉȵɲɳñƞǹṅṇṉṋꞑꞥ",
	"őȱɵòóôõöøōŏơǒǫǭǿȍȏȫȭȯӧөӫ",
	"ƥᵱᵽṕṗꝑꝓꝕ",
	"ɋʠꝙ",
	"ŕŗřȑȓɍɾṙṛṝṟꞧ",
	"šșʂśŝşȿṡṣṥṧṩꞩ",
	"ţťŧȶʈƫƭțṫṭṯṱᵵẗⱦ",
	"ũűųȕȗʉùúûüūŭůưǔǖǘǚߎ",
	"ṽṿⱴꝟ",
	"ŵẁẃẅẇẉẘ",
	"ẋẍ",
	"ŷȳýÿƴɏẏẙỳỵỷỹ",
	"ȥɀʐʑźżžƶᵶẑẓẕⱬ"
].map(row => [...row]);

(function(storyContent) {
	// save slots
	const CHOICE_HISTORY_KEY = 'choiceHistory';
	const STITCH_HISTORY_KEY = 'stitchHistory';
	const SLOT_SORT_KEY = 'slot-sort';
	const SLOT_INDEX_KEY = 'save-index';
	const SEEN_FLOW_KEY = "seen-paths";
	const DEFAULT_SAVE_SLOT = 1;
	
	// other variables
	let story = new inkjs.Story(storyContent);
	let choiceHistory = [];
	let stitchHistory = [];
	let seenFlow = readFlowMap();
	let vars = story.variablesState;
	
	// bound ink functions
	story.BindExternalFunction("cap", (string) => {
		return capitalise(string);
	}, true);
	
	story.BindExternalFunction("glitch", (string) => {
		const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		let new_text = "";
		
		for (const c of string) {
			if (c in alphabet) {
				let loc = alphabet.indexOf(c);
				new_text += g_alphabet[loc][Math.floor(Math.random() * (g_alphabet[loc].length - 1))];
			} else {
				new_text += c;
			}
		}
		return new_text;
	}, false);
	
	story.BindExternalFunction("curr_route", () => {
		return getCurrStitch()[0][0];
	}, true);
	
	story.allowExternalFunctionFallbacks = true;
	
	let animationEnabled = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
	window.matchMedia('(prefers-reduced-motion: no-preference)').addEventListener('change', e => {
		animationEnabled = e.matches;
	});
	
	// tags
	let currentAudio = null;
	let currentAudioLoop = null;
	let globalTagTheme;
	let globalTags = story.globalTags;
	if (globalTags) {
		for (let i=0; i < globalTags.length; i++) {
			let globalTag = globalTags[i];
			let splitTag = splitPropertyTag(globalTag);
			if (splitTag && splitTag.property === "theme") {
				globalTagTheme = splitTag.val;
			}
			else if (splitTag && splitTag.property === "author") {
				let byline = document.querySelector('.byline');
				byline.innerHTML = "by "+splitTag.val;
			}
		}
	}
	
	let storyContainer = document.querySelector('#story');
	let outerScrollContainer = document.querySelector('.outerContainer');
	const backEl = document.getElementById("back");
	
	setupTheme(globalTagTheme);
	story.ResetState();
	vars = story.variablesState;
	
	const TAG_HANDLERS = {
		AUDIO(val) {
			if (currentAudio) currentAudio.pause();
			currentAudio = new Audio(val);
			currentAudio.play();
		},
		AUDIOLOOP(val) {
			if (currentAudioLoop) currentAudioLoop.pause();
			currentAudioLoop = new Audio(val);
			currentAudioLoop.play();
			currentAudioLoop.loop = true;
		},
		IMAGE(val, ctx) {
			const imageElement = document.createElement('img');
			imageElement.src = val;
			storyContainer.appendChild(imageElement);
			imageElement.onload = () => {
				console.log(`scrollingto ${ctx.previousBottomEdge}`);
				scrollDown(ctx.previousBottomEdge);
			};
			showAfter(ctx.delay, imageElement);
			ctx.delay += 200.0;
		},
		LINK(val) { window.location.href = val; },
		LINKOPEN(val) { window.open(val); },
		BACKGROUND(val) { outerScrollContainer.style.backgroundImage = 'url(' + val + ')'; },
		CLASS(val, ctx) { ctx.customClasses.push(val); }
	};
	
	// reload button is only enabled if default save slot exists
	setupButtons(!!window.localStorage.getItem(getSaveName(DEFAULT_SAVE_SLOT)));
	
	// resume from autosave if possible
	const autosaved = readChoiceList(CHOICE_HISTORY_KEY);
	if (autosaved && autosaved.length > 0) {
		loadFromKey(autosaved);
	} else {
		choiceHistory = [];
		stitchHistory = [];
		continueStory(true);
	}
	
	function continueStory(firstTime) {
		let delay = 0.0;
		let previousBottomEdge = firstTime ? 0 : contentBottomEdgeY();
		if (backEl.getAttribute("disabled") && choiceHistory.length > 0) {
			backEl.removeAttribute("disabled");
		}
		
		// pull paragraphs until the next choice point or end of flow
		while (story.canContinue) {
			let paragraphText = story.Continue();
			recordStitch();
			let tags = story.currentTags;
			
			// formatting & tag processing
			let customClasses = [];
			const ctx = { delay, previousBottomEdge, customClasses };
			for (let i=0; i<tags.length; i++) {
				let tag = tags[i];
				let splitTag = splitPropertyTag(tag);
				if (splitTag) {
					const prop = splitTag.property.toUpperCase();
					const handler = TAG_HANDLERS[prop];
					if (handler) handler(splitTag.val, ctx);
				}
				
				// clearing
				else if (tag === "CLEAR" || tag === "RESTART") {
					removeAll("p");
					removeAll("img");
					setVisible(".header", false);
					if (tag === "RESTART") {
						restart();
						return;
					}
				}
			}
			delay = ctx.delay;
			if (paragraphText.trim().length === 0) {
				continue;
			}
			let paragraphElement = document.createElement('p');
			paragraphElement.innerHTML = paragraphText;
			storyContainer.appendChild(paragraphElement);
			for (let i=0; i<customClasses.length; i++) {
				paragraphElement.classList.add(customClasses[i]);
			}
			showAfter(delay, paragraphElement);
			delay += 200.0;
		}
		persistStitchHistory();
		
		// render choices
		story.currentChoices.forEach(function(choice) {
			let choiceTags = choice.tags;
			let customClasses = [];
			let isClickable = true;
			for (let i=0; i<choiceTags.length; i++) {
				let choiceTag = choiceTags[i];
				let splitTag = splitPropertyTag(choiceTag);
				if (splitTag) splitTag.property = splitTag.property.toUpperCase();
				if (choiceTag.toUpperCase() === "UNCLICKABLE") {
					isClickable = false;
				}
				if (splitTag && splitTag.property === "CLASS") {
					customClasses.push(splitTag.val);
				}
			}
			let choiceParagraphElement = document.createElement('p');
			choiceParagraphElement.classList.add("choice");
			for (let i=0; i<customClasses.length; i++) {
				choiceParagraphElement.classList.add(customClasses[i]);
			}
			if (isClickable) {
				choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
			} else {
				choiceParagraphElement.innerHTML = `<span class='unclickable'>${choice.text}</span>`
			}
			storyContainer.appendChild(choiceParagraphElement);
			showAfter(delay, choiceParagraphElement);
			delay += 200.0;
			
			if (isClickable) {
				let choiceAnchorEl = choiceParagraphElement.querySelector("a");
				choiceAnchorEl.addEventListener("click", function(event) {
					event.preventDefault();
					const lockedHeight = contentBottomEdgeY();
					storyContainer.style.height = lockedHeight + "px";
					removeAll(".choice");
					choiceHistory.push(choice.index);
					persistHistory();
					story.ChooseChoiceIndex(choice.index);
					continueStory();
				});
			}
		});
		storyContainer.style.height = "";
		if (!firstTime) {
			scrollDown(previousBottomEdge);
		}
	}
	
	function replayChoices(choices) {
		story.ResetState();
		vars = story.variablesState;
		for (let i = 0; i < choices.length; i++) {
			// burn through the paragraphs of the current passage silently, processing only the tags we need to preserve persistent state
			while (story.canContinue) {
				story.Continue();
				recordStitch();
				const tags = story.currentTags;
				
				for (let i = 0; i < tags.length; i++) {
					let tag = tags[i];
					let splitTag = splitPropertyTag(tag);
					
					if (splitTag) splitTag.property = splitTag.property.toUpperCase();
					// restore the most recent background image set by the story
					if (splitTag && splitTag.property === "BACKGROUND") {
						outerScrollContainer.style.backgroundImage = 'url(' + splitTag.val + ')';
					}
					
					// restore the currently-playing background music loop
					else if (splitTag && splitTag.property === "AUDIOLOOP") {
						if (currentAudioLoop) {
							currentAudioLoop.pause();
						}
						currentAudioLoop = new Audio(splitTag.val);
						currentAudioLoop.play();
						currentAudioLoop.loop = true;
					}
					
					// hide the header if any CLEAR/RESTART happened in this playthrough
					else if (tag === "CLEAR" || tag === "RESTART") {
						setVisible(".header", false);
					}
				}
			}
			
			// pick the recorded choice and move into the next passage
			story.ChooseChoiceIndex(choices[i]);
		}
	}
	
	function persistHistory() {
		writeChoiceList(CHOICE_HISTORY_KEY, choiceHistory);
	}
	
	function recordStitch() {
		const id = cleanStitchId(story.state.currentPathString);
		// no duping
		if (id && stitchHistory[stitchHistory.length - 1] !== id) {
			const previousStitch = stitchHistory[stitchHistory.length - 1];
			stitchHistory.push(id);
			recordFlowEdge(previousStitch, id);
		}
	}
	
	function recordFlowEdge(parent, child) {
		if (!parent || !child || parent === child) return;
		const children = seenFlow[parent] || (seenFlow[parent] = []);
		if (!children.includes(child)) {
			children.push(child);
			writeFlowMap(seenFlow);
		}
	}
	
	function readFlowMap() {
		try {
			let raw = window.localStorage.getItem(SEEN_FLOW_KEY);
			let parsed = raw ? JSON.parse(raw) : null;
			return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : {};
		} catch (e) {
			console.warn("Couldn't read flow map", e);
			return {};
		}
	}
	
	function writeFlowMap(map) {
		try {
			window.localStorage.setItem(SEEN_FLOW_KEY, JSON.stringify(map));
		} catch (e) {
			console.warn("Couldn't write flow map", e);
		}
	}
	
	function cleanStitchId(path) {
		if (!path) return path;
		return path.split(".").slice(0, 2).join(".");
	}
	
	function persistStitchHistory() {
		writeChoiceList(STITCH_HISTORY_KEY, stitchHistory);
	}
	
	function writeChoiceList(key, list) {
		try {
			window.localStorage.setItem(key, JSON.stringify(list));
		} catch (e) {
			console.warn("Couldn't write save", key, e);
		}
	}
	
	function readChoiceList(key) {
		try {
			let raw = window.localStorage.getItem(key);
			if (!raw) return null;
			let parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed : null;
		} catch (e) {
			console.warn("Couldn't read save", key, e);
			return null;
		}
	}
	
	function loadFromKey(slotKey) {
		if (slotKey === null) return false;
		choiceHistory = slotKey;
		persistHistory();
		stitchHistory = [];
		if (!backEl.getAttribute("disabled") && choiceHistory.length === 0) {
			backEl.setAttribute("disabled", "disabled");
		}
		clearDom();
		replayChoices(choiceHistory);
		continueStory(true);
		return true;
	}
	
	function restart() {
		backEl.setAttribute("disabled", "disabled");
		story.ResetState();
		vars = story.variablesState;
		choiceHistory = [];
		persistHistory();
		stitchHistory = [];
		clearDom();
		setVisible(".header", true);
		continueStory(true);
		outerScrollContainer.scrollTo(0, 0);
	}
	
	function clearDom() {
		removeAll("p");
		removeAll("img");
	}
	
	function showAfter(delay, el) {
		if (animationEnabled) {
			el.classList.add("hide");
			setTimeout(function() { el.classList.remove("hide") }, delay);
		} else {
			el.classList.remove("hide");
		}
	}
	
	function scrollDown(previousBottomEdge) {
		if (!animationEnabled) {
			return;
		}
		let target = previousBottomEdge;
		let limit = outerScrollContainer.scrollHeight - outerScrollContainer.clientHeight;
		if (target > limit) {
			target = limit;
		}
		let start = outerScrollContainer.scrollTop;
		let dist = target - start;
		let duration = 300 + 300*dist/100;
		let startTime = null;
		
		function step(time) {
			if (startTime == null) {
				startTime = time;
			}
			let t = (time-startTime) / duration;
			let lerp = 3*t*t - 2*t*t*t;
			outerScrollContainer.scrollTo(0, (1.0-lerp)*start + lerp*target);
			if (t < 1) {
				requestAnimationFrame(step);
			}
		}
		
		requestAnimationFrame(step);
	}
	
	function contentBottomEdgeY() {
		let bottomElement = storyContainer.lastElementChild;
		return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
	}
	
	function removeAll(selector) {
		const allElements = storyContainer.querySelectorAll(selector);
		for (const el of allElements) {
			el.remove();
		}
	}
	
	function setVisible(selector, visible) {
		const allElements = storyContainer.querySelectorAll(selector);
		for (const el of allElements) {
			if (!visible) {
				el.classList.add("invisible");
			} else {
				el.classList.remove("invisible");
			}
		}
	}
	
	function splitPropertyTag(tag) {
		let propertySplitIdx = tag.indexOf(":");
		if (propertySplitIdx !== -1) {
			let property = tag.substr(0, propertySplitIdx).trim();
			let val = tag.substr(propertySplitIdx+1).trim();
			return {property: property, val: val};
		}
		return null;
	}
	
	function setupTheme(globalTagTheme) {
		let savedTheme;
		try {
			savedTheme = window.localStorage.getItem('theme');
		} catch (e) {
			console.debug("Couldn't load saved theme");
		}
		let browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (savedTheme === "dark" || (!savedTheme && globalTagTheme === "dark") || (!savedTheme && !globalTagTheme && browserDark)) {
			document.body.classList.add("dark");
		}
	}
	
	function getSaveName(slot) {
		return "save-slot-" + String(slot);
	}
	
	function readSlotIndex() {
		try {
			let raw = window.localStorage.getItem(SLOT_INDEX_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch (e) { return []; }
	}
	
	function writeSlotIndex(ids) {
		try {
			window.localStorage.setItem(SLOT_INDEX_KEY, JSON.stringify(ids));
		} catch (e) { console.warn("Couldn't write slot index", e); }
	}
	
	function readSlot(id) {
		try {
			let raw = window.localStorage.getItem(getSaveName(id));
			return raw ? JSON.parse(raw) : null;
		} catch (e) { return null; }
	}
	
	function writeSlot(id, payload) {
		try {
			window.localStorage.setItem(getSaveName(id), JSON.stringify(payload));
		} catch (e) { console.warn("Couldn't write slot", id, e); }
	}
	
	// stats helpers
	function toString(item) {
		return String(vars.$(item));
	}
	
	function capitalise(val) {
		return val.charAt(0).toUpperCase() + val.slice(1);
	}
	
	function stringifyItem(item) {
		switch (item) {
			case "serrie":
				return serrieItem();
			case "money":
				return "Money (" + toString("riches") + "x)";
			default:
				return capitalise(item);
		}
	}
	
	function serrieItem() {
		if (vars.$("serrie_known")) {
			if (vars.$("corr_serrie")) {
				return "S̵̖̓e̶̥͠r̷͇̓r̷̲̀.̷͚̋ ̵̩͘D̴̨̂ȧ̸̹g̷̢̑g̸͕̔è̸͎r̸͔̓";
			} else {
				return "Serr. Dagger";
			}
		} else {
			return capitalise(toString("p_col")) + " Pendant";
		}
	}
	
	function wieldCol(weapon) {
		if (weapon.includes(" & ")) {
			const weapons = weapon.split(" & ");
			return colour(mixWeaponCols(weapons[0], weapons[1]));
		} else {
			return weaponCol(weapon);
		}
	}
	
	function weaponCol(weapon) {
		return colour(getWeaponCol(weapon));
	}
	
	function getWeaponCol(weapon) {
		let prefix;
		switch (weapon.toLowerCase()) {
			case "estoc":
				prefix = "e";
				break;
			case "scimitar":
				prefix = "s";
				break;
			case "recurve":
				prefix = "r";
				break;
			default:
				prefix = "p";
		}
		return toString(prefix + "_col");
	}
	
	function mixWeaponCols(weapon1, weapon2) {
		const i1 = COLOUR_INDEX[getWeaponCol(weapon1)];
		const i2 = COLOUR_INDEX[getWeaponCol(weapon2)];
		const diff = i1 - i2;
		let mixed = Math.floor((i1 + i2) / 2);
		let halfLen = Math.floor(COLOURS.length / 2);
		if (diff > halfLen || -diff > halfLen) {
			mixed += halfLen;
		}
		return COLOURS[mixed];
	}
	
	function statRGB(red, yellow, green, blue, purple) {
		const most = Math.max(red, yellow, green, blue, purple);
		let fixedRed = red;
		let fixedYellow = yellow;
		let fixedGreen = green;
		let fixedBlue = blue;
		let fixedPurple = purple;
		
		if (most === red) fixedRed *= 1.2;
		if (most === yellow) fixedYellow *= 1.2;
		if (most === green) fixedGreen *= 1.2;
		if (most === blue) fixedBlue *= 1.2;
		if (most === purple) fixedPurple *= 1.2;
		
		const rShare = (fixedRed + fixedYellow + fixedPurple) / 1.2; // nerf to account for higher red
		const gShare = fixedGreen + fixedYellow;
		const bShare = fixedBlue + fixedPurple;
		return getRGB(rShare, gShare, bShare);
	}
	
	function getRGB(rShare, gShare, bShare) {
		const multiplier = 255 / Math.max(rShare, gShare, bShare);
		const r = Math.round(rShare * multiplier);
		const g = Math.round(gShare * multiplier);
		const b = Math.round(bShare * multiplier);
		return `rgb(${r}, ${g}, ${b})`;
	}
	
	function colour(col) {
		const s = COLOUR_SHARES[col];
		return s ? getRGB(s[0], s[1], s[2]) : getRGB(0, 0, 0);
	}
	
	let statEls = null;
	
	function updateStats() {
		if (!statEls) {
			statEls = {
				name: document.getElementById("stat-name"),
				wielding: document.getElementById("stat-wielding"),
				inventory: document.getElementById("stat-inventory"),
				wearing: document.getElementById("stat-wearing"),
				red: document.getElementById("stat-red"),
				yellow: document.getElementById("stat-yellow"),
				green: document.getElementById("stat-green"),
				blue: document.getElementById("stat-blue"),
				purple: document.getElementById("stat-purple")
			};
		}
		
		// name
		const red = vars.$("red");
		const yellow = vars.$("yellow");
		const green = vars.$("green");
		const blue = vars.$("blue");
		const purple = vars.$("purple");
		
		statEls.name.textContent = getCharlieName();
		statEls.name.style.color = statRGB(red, yellow, green, blue, purple);
		
		// wielding
		const wielding = vars.$("wielding");
		let wieldColour;
		statEls.wielding.textContent = wielding;
		if (wielding === "None") {
			wieldColour = document.body.classList.contains("dark") ? "#ffffff" : "#000000";
		} else {
			wieldColour = wieldCol(wielding);
		}
		statEls.wielding.style.color = wieldColour;
		
		// inventory
		const inv = toString("inv").split(", ");
		statEls.inventory.textContent = "";
		inv.forEach((item, i) => {
			const span = document.createElement("span");
			span.textContent = stringifyItem(item);
			if (item === "estoc" || item === "scimitar" || item === "recurve" || (item === "serrie" && vars.$("serrie_known"))) {
				span.style.color = weaponCol(item);
			}
			statEls.inventory.appendChild(span);
			if (i < inv.length - 1) {
				statEls.inventory.appendChild(document.createTextNode(", "));
			}
		});
		
		// other stats
		statEls.wearing.textContent = vars.$("wearing");
		statEls.red.textContent = red;
		statEls.yellow.textContent = yellow;
		statEls.green.textContent = green;
		statEls.blue.textContent = blue;
		statEls.purple.textContent = purple;
	}
	
	const POSS_WEAPON = { 1: "estoc", 2: "scimitar", 3: "serrie" };
	const WEAPON_NAMES = ["estoc", "scimitar", "serrie", "recurve"];
	
	function getCurrentWeapons() {
		const held = [];
		
		function addWeapon(name) {
			if (WEAPON_NAMES.includes(name) && !held.includes(name)) {
				held.push(name);
			}
		}
		
		const wielding = toString("wielding");
		if (wielding && wielding !== "None") {
			wielding.split(" & ").forEach(function (w) {
				addWeapon(w.trim().toLowerCase());
			});
		}
		
		const inv = toString("inv").split(", ");
		inv.forEach(function (item) {
			const li = item.trim().toLowerCase();
			if (li === "serrie" && !vars.$("serrie_known")) return;
			addWeapon(li);
		});
		
		const possWeapon = POSS_WEAPON[vars.$("poss")];
		
		return held.slice(0, 4).map(function (w) {
			let possAppend = "";
			if (w === possWeapon) {
				possAppend = "_p";
			}
			return "assets/icons/" + w + "/" + getWeaponCol(w) + possAppend;
		});
	}
	
	function getCharlieName() {
		const amount = vars.$("poss_amount");
		switch (amount) {
			case 1:
				return "Ćȟąrlĩḛ";
			case 2:
				return "Ĉ̴̯h̴̲͝à̷̝r̷͍̕ĺ̶̹i̷̤͝e̶̠͌";
			default:
				return "Charlie";
		}
	}
	
	function setupButtons(hasSave) {
		let saveSlot;
		
		let rewindEl = document.getElementById("rewind");
		rewindEl.addEventListener("click", function(event) {
			restart();
		});
		
		// pop the last choice and replay everything before it
		if (choiceHistory.length === 0) {
			backEl.setAttribute("disabled", "disabled");
		}
		backEl.addEventListener("click", function(event) {
			if (backEl.getAttribute("disabled")) {
				return;
			}
			choiceHistory.pop();
			persistHistory();
			stitchHistory = [];
			if (choiceHistory.length === 0) {
				backEl.setAttribute("disabled", "disabled");
			}
			clearDom();
			replayChoices(choiceHistory);
			continueStory(true);
		});
		
		// toggle dark/light and persist the choice
		let themeSwitchEl = document.getElementById("theme-switch");
		themeSwitchEl.addEventListener("click", function(event) {
			document.body.classList.add("switched");
			document.body.classList.toggle("dark");
			try {
				localStorage.setItem('theme', document.body.classList.contains("dark") ? "dark" : "light");
			} catch (e) {}
			if (typeof window.reloadDiagram === "function") {
				window.reloadDiagram();
			}
		});
		
		// save menu
		let modalEl = document.getElementById("slot-modal");
		let listEl = document.getElementById("slot-list");
		let emptyEl = document.getElementById("slot-empty");
		let newEl = document.getElementById("slot-new");
		let labelEl = document.getElementById("slot-new-label");
		let confirmEl = document.getElementById("slot-new-confirm");
		let template = document.getElementById("slot-row-template");
		let statsModalEl = document.getElementById("stats-modal");
		let flowchartModalEl = document.getElementById("flowchart-modal");
		let allModals = [modalEl, statsModalEl, flowchartModalEl];
		let debugToggleEl = document.getElementById("debug-toggle");
		let flowchartDownloadSvgEl = document.getElementById("flowchart-download-svg");
		let flowchartDownloadPngEl = document.getElementById("flowchart-download-png");
		let debugMode = false;
		
		function closeAllModals() {
			allModals.forEach(function (m) { m.classList.add("hidden"); });
			labelEl.value = "";
		}
		
		function openSaveModal() {
			closeAllModals();
			renderSlots();
			modalEl.classList.remove("hidden");
		}
		
		function closeSaveModal() {
			modalEl.classList.add("hidden");
			labelEl.value = "";
		}
		
		function openStatsModal() {
			closeAllModals();
			updateStats();
			statsModalEl.classList.toggle("debug-mode", debugMode);
			statsModalEl.classList.remove("hidden");
		}
		
		function closeStatsModal() {
			statsModalEl.classList.add("hidden");
		}
		
		function openFlowchartModal() {
			closeAllModals();
			if (typeof window.resetFlowchartView === "function") {
				window.resetFlowchartView();
			}
			if (typeof window.reloadDiagram === "function") {
				window.reloadDiagram();
			}
			flowchartModalEl.classList.remove("hidden");
		}
		
		function closeFlowchartModal() {
			flowchartModalEl.classList.add("hidden");
		}
		
		function triggerDownload(url, filename) {
			let a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
		
		function getFlowchartSvgData() {
			let svgEl = document.querySelector("#diagramElement svg");
			if (!svgEl) return null;
			
			let svgClone = svgEl.cloneNode(true);
			svgClone.removeAttribute("style");
			if (!svgClone.getAttribute("xmlns")) {
				svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
			}
			
			let vb = svgEl.viewBox && svgEl.viewBox.baseVal;
			let width = (vb && vb.width) || svgEl.getBBox().width || 1000;
			let height = (vb && vb.height) || svgEl.getBBox().height || 1000;
			svgClone.setAttribute("width", width);
			svgClone.setAttribute("height", height);
			
			let svgString = new XMLSerializer().serializeToString(svgClone);
			return { svgString: svgString, width: width, height: height };
		}
		
		function downloadFlowchartSvg() {
			let data = getFlowchartSvgData();
			if (!data) return;
			
			let svgUrl = URL.createObjectURL(new Blob([data.svgString], { type: "image/svg+xml;charset=utf-8" }));
			triggerDownload(svgUrl, "flowchart.svg");
			URL.revokeObjectURL(svgUrl);
		}
		
		function downloadFlowchartPng() {
			let data = getFlowchartSvgData();
			if (!data) return;
			let svgDataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data.svgString);
			
			let img = new Image();
			img.onload = function () {
				try {
					let scale = 2;
					let canvas = document.createElement("canvas");
					canvas.width = data.width * scale;
					canvas.height = data.height * scale;
					let ctx = canvas.getContext("2d");
					ctx.fillStyle = document.body.classList.contains("dark") ? "#000000" : "#ffffff";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					canvas.toBlob(function (blob) {
						if (!blob) {
							console.error("Flowchart PNG export failed: canvas.toBlob returned null (canvas may be tainted).");
							return;
						}
						let pngUrl = URL.createObjectURL(blob);
						triggerDownload(pngUrl, "flowchart.png");
						URL.revokeObjectURL(pngUrl);
					}, "image/png");
				} catch (e) {
					console.error("Flowchart PNG export failed:", e);
				}
			};
			img.onerror = function (e) {
				console.error("Flowchart PNG export failed: could not load SVG as an image.", e);
			};
			img.src = svgDataUri;
		}
		
		function formatDate(date) {
			return date.toLocaleTimeString(navigator.language, {
				day: '2-digit',
				month: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		}
		
		function sortSlots(slots, mode) {
			let copy = slots.slice();
			switch (mode) {
				case "oldest":
					copy.sort(function (a, b) { return a.savedAt - b.savedAt; });
					break;
				case "label":
					copy.sort(function (a, b) {
						let la = (a.label || "").toLowerCase();
						let lb = (b.label || "").toLowerCase();
						
						// unnamed saves sink to the bottom so the A→Z list stays clean
						if (!la && lb) return 1;
						if (la && !lb) return -1;
						if (la === lb) return b.savedAt - a.savedAt;
						return la < lb ? -1 : 1;
					});
					break;
				case "progress":
					copy.sort(function (a, b) {
						if (b.choiceCount !== a.choiceCount) return b.choiceCount - a.choiceCount;
						return b.savedAt - a.savedAt;
					});
					break;
				default:
					copy.sort(function (a, b) { return b.savedAt - a.savedAt; });
					break;
			}
			return copy;
		}
		
		let sortEl = document.getElementById("slot-sort");
		
		// restore persisted sort choice
		try {
			let savedSort = window.localStorage.getItem(SLOT_SORT_KEY);
			if (savedSort) sortEl.value = savedSort;
		} catch (e) {}
		
		function renderSlotWeapons(container, weapons) {
			container.innerHTML = "";
			if (!Array.isArray(weapons)) return;
			weapons.forEach(function (w) {
				let icon = document.createElement("img");
				icon.src = w + ".png";
				icon.alt = capitalise(w.replace("_poss", ""));
				icon.title = icon.alt;
				icon.classList.add("slot-row-weapon-icon");
				container.appendChild(icon);
			});
		}
		
		function renderSlots() {
			listEl.innerHTML = "";
			let ids = readSlotIndex();
			let slots = ids
			.map(function (id) {
				let s = readSlot(id);
				return s ? Object.assign({ id: id }, s) : null;
			})
			.filter(Boolean);
			emptyEl.classList.toggle("hidden", slots.length > 0);
			slots = sortSlots(slots, sortEl.value);
			
			slots.forEach(function (slot) {
				let row = template.content.firstElementChild.cloneNode(true);
				row.dataset.slotId = slot.id;
				let nameEl = row.querySelector(".slot-row-name");
				nameEl.textContent = slot.name || "";
				nameEl.style.color = slot.colour;
				row.querySelector(".slot-row-label").textContent = slot.label || "(unnamed)";
				row.querySelector(".slot-row-knot").textContent = slot.knot || "";
				renderSlotWeapons(row.querySelector(".slot-row-weapons"), slot.weapons);
				row.querySelector(".slot-row-date").textContent = formatDate(new Date(slot.savedAt));
				listEl.appendChild(row);
			});
		}
		
		sortEl.addEventListener("change", function () {
			try {
				window.localStorage.setItem(SLOT_SORT_KEY, sortEl.value);
			} catch (e) {}
			renderSlots();
		});
		document.getElementById("save").addEventListener("click", openSaveModal);
		document.getElementById("stats").addEventListener("click", openStatsModal);
		document.getElementById("flowchart-open").addEventListener("click", openFlowchartModal);
		
		// toggle the AP stats on/off
		debugToggleEl.addEventListener("click", function () {
			debugMode = !debugMode;
			statsModalEl.classList.toggle("debug-mode", debugMode);
		});
		
		// export the flowchart as an image
		flowchartDownloadSvgEl.addEventListener("click", function () {
			downloadFlowchartSvg();
		});
		flowchartDownloadPngEl.addEventListener("click", function () {
			downloadFlowchartPng();
		});
		
		// close on backdrop or ✕
		modalEl.addEventListener("click", function (e) {
			if (e.target.hasAttribute("data-close")) closeSaveModal();
		});
		statsModalEl.addEventListener("click", function (e) {
			if (e.target.hasAttribute("data-close")) closeStatsModal();
		});
		flowchartModalEl.addEventListener("click", function (e) {
			if (e.target.hasAttribute("data-close")) closeFlowchartModal();
		});
		
		confirmEl.addEventListener("click", function () {
			createSlot(labelEl.value.trim());
			labelEl.value = "";
			renderSlots();
		});
		
		// delegated row actions (Load / Rename / Delete)
		listEl.addEventListener("click", function (e) {
			let btn = e.target.closest("[data-action]");
			if (!btn) return;
			let row = btn.closest(".slot-row");
			let id  = row.dataset.slotId;
			
			if (btn.dataset.action === "load") {
				loadSlot(id);
				closeSaveModal();
			} else if (btn.dataset.action === "delete") {
				if (confirm("Delete this save?")) {
					deleteSlot(id);
					renderSlots();
				}
			} else if (btn.dataset.action === "rename") {
				let next = prompt("New label:", readSlot(id).label || "");
				if (next !== null) {
					let slot = readSlot(id);
					slot.label = next;
					writeSlot(id, slot);
					renderSlots();
				}
			}
		});
		
		function getLatestChapter() {
			const visits = story.state._visitCounts;
			const chapters = [];
			const entries = visits instanceof Map ? visits.entries() : Object.entries(visits);
			
			for (const [path, count] of entries) {
				if (count > 0) {
					const match = path.match(/^(?:[a-z]+_)?ch(\d+)(?:\.|$)/);
					if (match) chapters.push(parseInt(match[1], 10));
				}
			}
			return chapters.length ? Math.max(...chapters) : 0;
		}
		
		function getCurrStitch() {
			return story.currentChoices[0].sourcePath.split(".");
		}
		
		function createSlot(label) {
			const now = Date.now();
			const id = String(now);
			const choicePath = getCurrStitch();
			const currKnot = "ch" + String(getLatestChapter()) + "." + choicePath[1];
			writeSlot(id, {
				history: choiceHistory.slice(),
				savedAt: now,
				label: label || "",
				knot: currKnot || "",
				choiceCount: choiceHistory.length,
				weapons: getCurrentWeapons(),
				name: getCharlieName(),
				colour: statRGB(vars.$("red"), vars.$("yellow"), vars.$("green"), vars.$("blue"), vars.$("purple"))
			});
			let index = readSlotIndex();
			index.unshift(id);
			writeSlotIndex(index);
			return id;
		}
		
		function deleteSlot(id) {
			window.localStorage.removeItem(getSaveName(id));
			writeSlotIndex(readSlotIndex().filter(function (x) { return x !== id; }));
		}
		
		function loadSlot(id) {
			const slot = readSlot(id);
			if (!slot || !Array.isArray(slot.history)) return false;
			return loadFromKey(slot.history);
		}
	}
})(storyContent);