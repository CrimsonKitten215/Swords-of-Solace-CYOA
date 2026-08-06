window.initFlowchart = function (mermaid) {
	
	const FLOWCHART_COLOURS = {
		light: {
			primaryColor: '#ffffff',
			primaryTextColor: '#000000',
			primaryBorderColor: '#000000',
			lineColor: '#000000',
			secondaryColor: '#cccccc',
			secondaryTextColor: '#000000',
			tertiaryColor: '#cccccc',
			tertiaryTextColor: '#000000',
			tertiaryBorderColor: '#000000',
			background: '#ffffff',
			mainBkg: '#ffffff',
			fontFamily: 'serif'
		},
		dark: {
			primaryColor: '#000000',
			primaryTextColor: '#ffffff',
			primaryBorderColor: '#ffffff',
			lineColor: '#ffffff',
			secondaryColor: '#333333',
			secondaryTextColor: '#ffffff',
			tertiaryColor: '#333333',
			tertiaryTextColor: '#ffffff',
			tertiaryBorderColor: '#ffffff',
			background: '#000000',
			mainBkg: '#000000',
			fontFamily: 'serif'
		}
	};
	
	function isDark() {
		return document.body.classList.contains('dark');
	}
	
	function currentThemeVariables() {
		return isDark() ? FLOWCHART_COLOURS.dark : FLOWCHART_COLOURS.light;
	}
	
	let panZoom = { scale: 1, x: 0, y: 0 };
	let panZoomWired = false;
	const MIN_SCALE = 1/32;
	const MAX_SCALE = 1;
	
	function clampScale(s) {
		return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
	}
	
	function applyTransform() {
		const svgEl = diagramElement.querySelector('svg');
		if (!svgEl) return;
		svgEl.style.transformOrigin = '0 0';
		svgEl.style.transform = `translate(${panZoom.x}px, ${panZoom.y}px) scale(${panZoom.scale})`;
	}
	
	function centreDiagram() {
		const svgEl = diagramElement.querySelector('svg');
		if (!svgEl) return;
		const containerRect = diagramElement.getBoundingClientRect();
		const vb = svgEl.viewBox && svgEl.viewBox.baseVal;
		const svgW = (vb && vb.width) || svgEl.getBBox().width;
		const svgH = (vb && vb.height) || svgEl.getBBox().height;
		panZoom.x = (containerRect.width  - svgW * panZoom.scale) / 2;
		panZoom.y = (containerRect.height - svgH * panZoom.scale) / 2;
	}
	
	function resetPanZoom() {
		panZoom = { scale: 1/2, x: 0, y: 0 };
		centreDiagram();
		applyTransform();
	}
	window.resetFlowchartView = resetPanZoom;
	
	function wirePanZoom() {
		if (panZoomWired) return;
		panZoomWired = true;
		let dragging = false;
		let lastX = 0, lastY = 0;
		
		diagramElement.addEventListener('mousedown', function (e) {
			dragging = true;
			lastX = e.clientX;
			lastY = e.clientY;
			diagramElement.classList.add('grabbing');
		});
		
		window.addEventListener('mousemove', function (e) {
			if (!dragging) return;
			panZoom.x += e.clientX - lastX;
			panZoom.y += e.clientY - lastY;
			lastX = e.clientX;
			lastY = e.clientY;
			applyTransform();
		});
		
		window.addEventListener('mouseup', function () {
			dragging = false;
			diagramElement.classList.remove('grabbing');
		});
		
		diagramElement.addEventListener('wheel', function (e) {
			e.preventDefault();
			const rect = diagramElement.getBoundingClientRect();
			const cx = e.clientX - rect.left;
			const cy = e.clientY - rect.top;
			const factor = e.deltaY < 0 ? 1.1 : 0.9;
			const newScale = clampScale(panZoom.scale * factor);
			const ratio = newScale / panZoom.scale;
			panZoom.x = cx - ratio * (cx - panZoom.x);
			panZoom.y = cy - ratio * (cy - panZoom.y);
			panZoom.scale = newScale;
			applyTransform();
		}, { passive: false });
		
		let touchState = null;
		
		function touchDist(t0, t1) {
			return Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
		}
		
		function touchMid(t0, t1) {
			return { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
		}
		
		diagramElement.addEventListener('touchstart', function (e) {
			if (e.touches.length === 1) {
				touchState = { mode: 'pan', lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
			} else if (e.touches.length === 2) {
				touchState = {
					mode: 'pinch',
					startDist: touchDist(e.touches[0], e.touches[1]),
					startScale: panZoom.scale,
					mid: touchMid(e.touches[0], e.touches[1])
				};
			}
		}, { passive: true });
		
		diagramElement.addEventListener('touchmove', function (e) {
			if (!touchState) return;
			e.preventDefault();
			if (touchState.mode === 'pan' && e.touches.length === 1) {
				const t = e.touches[0];
				panZoom.x += t.clientX - touchState.lastX;
				panZoom.y += t.clientY - touchState.lastY;
				touchState.lastX = t.clientX;
				touchState.lastY = t.clientY;
				applyTransform();
			} else if (touchState.mode === 'pinch' && e.touches.length === 2) {
				const rect = diagramElement.getBoundingClientRect();
				const dist = touchDist(e.touches[0], e.touches[1]);
				const newScale = clampScale(touchState.startScale * (dist / touchState.startDist));
				const mid = touchMid(e.touches[0], e.touches[1]);
				const cx = mid.x - rect.left;
				const cy = mid.y - rect.top;
				const ratio = newScale / panZoom.scale;
				panZoom.x = cx - ratio * (cx - panZoom.x);
				panZoom.y = cy - ratio * (cy - panZoom.y);
				panZoom.scale = newScale;
				applyTransform();
			}
		}, { passive: false });
		
		diagramElement.addEventListener('touchend', function (e) {
			if (e.touches.length === 0) {
				touchState = null;
			} else if (e.touches.length === 1) {
				touchState = { mode: 'pan', lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
			}
		});
		
		const resetBtn = document.getElementById('flowchart-reset');
		if (resetBtn) resetBtn.addEventListener('click', resetPanZoom);
	}
	
	function getChapter(prefix) {
		const index = prefix.indexOf("_");
		if (index === -1) {
			return Number(prefix.substring(2));
		} else {
			return Number(prefix.substring(index + 3));
		}
	}
	
	function getRoute(prefix) {
		const index = prefix.indexOf("_");
		if (index === -1) {
			return "";
		} else {
			return prefix.substring(0, index);
		}
	}
	
	function compileToMermaid() {
		// create formatter
		let fillCol;
		let textCol;
		
		if (isDark()) {
			fillCol = "#403647";
			textCol = "#ffffff";
		} else {
			fillCol = "#e8d7f6";
			textCol = "#000000";
		}
		
		const formatter = `
			graph TD
			classDef default stroke-width:2
			classDef curr fill:${fillCol},stroke:#9a6ebd,color:${textCol}
		`;
		
		// translate connections to mermaid
		const flow = JSON.parse(localStorage.getItem('seen-paths') || '{}');
		let knots = [];
		let connections = "";
		let branching = new Set();
		let allStitches = new Set();
		
		const outDegree = {};
		for (const [parent, children] of Object.entries(flow)) {
			outDegree[parent] = children.length;
		}
		
		const threadOf = {};
		const ambiguousPairs = [];
		const suppressedEdges = new Set();
		const processedPairs = new Set();
		
		for (const [parent, children] of Object.entries(flow)) {
			for (const child of children) {
				const reverseChildren = flow[child];
				if (!reverseChildren || !reverseChildren.includes(parent)) continue;
				
				const pairKey = parent < child ? `${parent}|${child}` : `${child}|${parent}`;
				if (processedPairs.has(pairKey)) continue;
				processedPairs.add(pairKey);
				
				const degParent = outDegree[parent] || 0;
				const degChild = outDegree[child] || 0;
				
				suppressedEdges.add(`${parent}>${child}`);
				suppressedEdges.add(`${child}>${parent}`);
				
				if (degParent === 1 && degChild > 1) {
					threadOf[parent] = child;
				} else if (degChild === 1 && degParent > 1) {
					threadOf[child] = parent;
				} else {
					ambiguousPairs.push([parent, child]);
				}
			}
		}
		
		for (const [parent, children] of Object.entries(flow)) {
			allStitches.add(parent);
			branching.add(parent);
			
			// get connections
			for (const [key, child] of Object.entries(children)) {
				allStitches.add(child);
				if (suppressedEdges.has(`${parent}>${child}`)) continue;
				connections += `\n${parent} --> ${child}`;
			}
			
		}
		
		// confirmed thread
		for (const [thread, hub] of Object.entries(threadOf)) {
			connections += `\n${thread} -.-> ${hub}`;
		}
		
		// fallback
		for (const [a, b] of ambiguousPairs) {
			connections += `\n${a} <-.-> ${b}`;
		}
		
		// sort every stitch into correct chapter
		for (const stitch of allStitches) {
			let sStitch = stitch.split(".");
			let chapter = getChapter(sStitch[0]);
			while (knots.length < chapter) {
				knots.push([]);
			}
			knots[chapter - 1].push(stitch);
		}
		
		// defining nodes
		let subgraphs = "";
		for (let i=0; i < knots.length; i++) {
			subgraphs += `\nsubgraph Ch${i + 1}[Chapter ${i + 1}]`;
			
			for (const stitch of knots[i]) {
				let sStitch = stitch.split(".");
				let route = getRoute(sStitch[0]);
				let label;
				
				if (route == "") {
					label = sStitch[1];
				} else {
					label = route + "." + sStitch[1];
				}
				
				if (threadOf.hasOwnProperty(stitch)) {
					subgraphs += `\n${stitch}{{${label}}}`;
				} else if (branching.has(stitch)) {
					subgraphs += `\n${stitch}([${label}])`;
				} else {
					subgraphs += `\n${stitch}[${label}]`;
				}
			}
			
			subgraphs += `\nend`;
		}
		
		// formatting visited stitches
		let visited = "\nclass ";
		const seen = JSON.parse(localStorage.getItem('stitchHistory') || '{}');
		
		for (const s of seen) {
			visited += s + ",";
		}
		
		visited = visited.substring(0, visited.length) + " curr";
		
		return formatter + connections + subgraphs + visited;
	}
	
	async function loadDiagram() {
		mermaid.initialize({
			startOnLoad: false,
			theme: 'base',
			themeVariables: currentThemeVariables(),
			flowchart: { htmlLabels: false }
		});
		
		const { svg } = await mermaid.render(
			"diagram-" + Date.now(),
			compileToMermaid()
		);
		
		diagramElement.innerHTML = svg;
		
		const svgEl = diagramElement.querySelector('svg');
		if (svgEl) {
			svgEl.style.display = 'block';
			svgEl.style.maxWidth = 'none';
			svgEl.style.maxHeight = 'none';
		}
		wirePanZoom();
		centreDiagram();
		applyTransform();
	}
	
	window.reloadDiagram = loadDiagram;
	loadDiagram();
	
};