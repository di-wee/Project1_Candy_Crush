let container = document.querySelector('.container');
let candies = ['Blue', 'Green', 'Orange', 'Purple', 'Red', 'Yellow'];
let pickedCandy;
let swoppedCandy;
let score = 0;
let moves = 0;
let highScore = 0;

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
			imgEl.id = 'lolli';
			imgEl.className = `${i}-${j}`;
			div.appendChild(imgEl);
			container.appendChild(div);
		}
	}
}

//event listeners
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
		//checking for adjacent candies
		const pickedArr = pickedCandy.className.split('-'); //return ['1', '1']
		const row = pickedArr[0];
		const r = Number(row);
		const column = pickedArr[1];
		const c = Number(column);
		const swopArr = swoppedCandy.className.split('-');
		const row2 = swopArr[0];
		const r2 = Number(row2);
		const column2 = swopArr[1];
		const c2 = Number(column2);
		let swopRight = r === r2 && c2 === c + 1; //if picked is [1/2] swopped is [1/3]
		let swopLeft = r === r2 && c2 === c - 1; //if picked is [1/2] swop is [1/1]
		let swopTop = r2 === r - 1 && c2 === c; //if picked is [2/1], swop is  [1/1]
		let swopBottom = r2 === r + 1 && c2 === c; //if picked is [2/1], swop is [3/1]
		const checkAdjacent = swopRight || swopLeft || swopTop || swopBottom;
		if (checkAdjacent) {
			//swopping candies mechanic
			let pickedImg = pickedCandy.src;
			let swoppedImg = swoppedCandy.src;
			pickedCandy.src = swoppedImg;
			swoppedCandy.src = pickedImg;
		}
	}
}

gameInit();
