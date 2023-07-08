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
	for (let i = 1; i < 9; i++) {
		for (let j = 1; j < 9; j++) {
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

	function dragLeave(event) {
		event.preventDefault();
	}

	function dragDrop(event) {
		swoppedCandy = event.target;
	}

	function dragEnd() {
		//only allow adjacent candies
		const pickedArr = pickedCandy.className.split('-'); //return ['1', '1']
		const pickedRow = Number(pickedArr[0]); // convert string into number
		const pickedColumn = Number(pickedArr[1]);
		const swopArr = swoppedCandy.className.split('-');
		const swoppedRow = Number(swopArr[0]);
		const swoppedColumn = Number(swopArr[1]);

		let swopRight =
			pickedRow === swoppedRow && swoppedColumn === pickedColumn + 1; //if picked is [1/2] swopped is [1/3]
		let swopLeft =
			pickedRow === swoppedRow && swoppedColumn === pickedColumn - 1; //if picked is [1/2] swop is [1/1]
		let swopTop =
			swoppedRow === pickedRow - 1 && swoppedColumn === pickedColumn; //if picked is [2/1], swop is  [1/1]
		let swopBottom =
			swoppedRow === pickedRow + 1 && swoppedColumn === pickedColumn; //if picked is [2/1], swop is [3/1]
		const checkAdjacent = swopRight || swopLeft || swopTop || swopBottom;
		if (checkAdjacent) {
			//swopping candies mechanic
			let pickedImg = pickedCandy.src;
			let swoppedImg = swoppedCandy.src;
			pickedCandy.src = swoppedImg;
			swoppedCandy.src = pickedImg;
		}

		// crush4Candies
	}
}

gameInit();
