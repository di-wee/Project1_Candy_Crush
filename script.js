let container = document.querySelector('.container');
let candies = ['Blue', 'Green', 'Orange', 'Purple', 'Red', 'Yellow'];
let pickedCandy;
let swoppedCandy;

//game logic:

function gameInit() {
	genGrid();
	eventListener();
}

function genGrid() {
	for (let i = 1; i < 7; i++) {
		for (let j = 1; j < 7; j++) {
			const div = document.createElement('div');
			div.className = 'candies';
			div.setAttribute('style', `grid-area:${i}/${j}/${i}/${j}`);
			const index = Math.floor(Math.random() * candies.length);
			const chosenCandy = candies[index];
			const imgEl = document.createElement('img');
			imgEl.src = `/candies/${chosenCandy}.png`;
			imgEl.className = `${i}-${j}`;
			imgEl.id = 'can';
			div.appendChild(imgEl);
			container.appendChild(div);
		}
	}
}

function eventListener() {
	container.addEventListener('dragstart', dragStart);
	container.addEventListener('dragover', dragOver);
	container.addEventListener('dragenter', dragEnter);
	container.addEventListener('dragleave', dragLeave);
	container.addEventListener('drop', dragDrop);
	container.addEventListener('dragend', dragEnd);

	function dragStart(event) {
		pickedCandy = event.target;
	}

	function dragOver(event) {
		event.preventDefault();
	}

	function dragEnter(event) {
		event.preventDefault();
	}

	function dragLeave() {}

	function dragDrop(event) {
		swoppedCandy = event.target;
	}

	function dragEnd() {
		let pickedImg = pickedCandy.src;
		let swoppedImg = swoppedCandy.src;
		pickedCandy.src = swoppedImg;
		swoppedCandy.src = pickedImg;
	}
}
gameInit();
