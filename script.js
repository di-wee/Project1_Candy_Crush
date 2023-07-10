//defining global variables
const container = document.querySelector('.container');
const candies = ['Blue', 'Green', 'Orange', 'Purple', 'Red', 'Yellow'];
let pickedCandy;
let swoppedCandy;
let score = 0;
let moves = 0;
let highScore = 0;
let totalRows = 5;
let totalColumn = 5;
let grid = [];

window.addEventListener('load', function () {
	gameInit();
	window.setInterval(function () {
		crushCandies();
		repopulateCandies();
	}, 100);
});

function gameInit() {
	genGrid();
	eventListener();
}

function genGrid() {
	for (let i = 1; i < totalRows + 1; i++) {
		let rows = [];
		for (let j = 1; j < totalColumn + 1; j++) {
			const div = document.createElement('div');
			div.className = 'candies';
			div.setAttribute('style', `grid-area:${i}/${j}/${i}/${j}`);
			const index = Math.floor(Math.random() * candies.length);
			const chosenCandy = candies[index];
			const imgEl = document.createElement('img');
			imgEl.src = `/candies/${chosenCandy}.png`;
			imgEl.className = `${i}-${j}`;
			div.appendChild(imgEl);
			container.appendChild(div);
			rows.push(imgEl);
		}
		grid.push(rows);
	}
	console.log(grid); //candies element now pushed to into an array to be accessed directly
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
		const pickedArr = pickedCandy.className.split('-'); //return ['index', '1', '1']
		const pickedRow = Number(pickedArr[0]); // convert string into number
		const pickedColumn = Number(pickedArr[1]);
		const swopArr = swoppedCandy.className.split('-');
		const swoppedRow = Number(swopArr[0]);
		const swoppedColumn = Number(swopArr[1]);
		if (
			!pickedCandy.src.includes('.png') &&
			!swoppedCandy.src.includes('.png')
		) {
			return;
		}

		function swopCandies() {
			let pickedImg = pickedCandy.src;
			let swoppedImg = swoppedCandy.src;
			pickedCandy.src = swoppedImg;
			swoppedCandy.src = pickedImg;
		}

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
			swopCandies();
		}

		let checkValid = isValid();

		if (!checkValid) {
			swopCandies();
		}

		crushCandies();
	}
}

function isValid() {
	for (let r = 0; r < totalRows; r++) {
		for (let c = 0; c < totalColumn - 2; c++) {
			const candy1 = grid[r][c];
			const candy2 = grid[r][c + 1];
			const candy3 = grid[r][c + 2];
			if (candy1.src == candy2.src && candy2.src == candy3.src) {
				return true;
			}
		}
	}
	for (let r = 0; r < totalRows - 2; r++) {
		for (let c = 0; c < totalColumn; c++) {
			const candy1 = grid[r][c];
			const candy2 = grid[r + 1][c];
			const candy3 = grid[r + 2][c];
			if (candy1.src == candy2.src && candy2.src == candy3.src) {
				return true;
			}
		}
	}
	return false;
}

function crushCandies() {
	crush3Candies();
	cascadeCandies();
	repopulateCandies();
	// crush4Candies();
	// crush5Candies();
}

function crush3Candies() {
	//horizontalcrush
	for (let r = 0; r < totalRows; r++) {
		for (let c = 0; c < totalColumn - 2; c++) {
			const candy1 = grid[r][c];
			const candy2 = grid[r][c + 1];
			const candy3 = grid[r][c + 2];
			if (candy1.src == candy2.src && candy2.src == candy3.src) {
				candy1.src = '';
				candy2.src = '';
				candy3.src = '';
			}
		}
	}

	//verticalcrush
	for (let r = 0; r < totalRows - 2; r++) {
		for (let c = 0; c < totalColumn; c++) {
			if (r === 5) break;
			const candy1 = grid[r][c];
			const candy2 = grid[r + 1][c];
			const candy3 = grid[r + 2][c];
			if (candy1.src == candy2.src && candy2.src == candy3.src) {
				//if candies get crushed .src = blank
				candy1.src = '';
				candy2.src = '';
				candy3.src = '';
			}
		}
	}
}
function cascadeCandies() {
	for (let c = 0; c < totalColumn; c++) {
		for (let r = totalRows - 1; r >= 0; r--) {
			for (let j = totalRows - 1; j >= 0; j--) {
				if (j === 0) break;
				const bottomC = grid[j][c];
				const topC = grid[j - 1][c];
				if (!bottomC.src.includes('.png') && topC.src.includes('.png')) {
					bottomC.src = topC.src;
					topC.src = '';
				}
			}
		}
	}
}

function repopulateCandies() {
	for (let c = 0; c < totalColumn; c++) {
		for (let r = totalRows - 1; r >= 0; r--) {
			for (let j = totalRows - 1; j >= 0; j--) {
				const candy = grid[r][c];
				if (!candy.src.includes('.png')) {
					const index = Math.floor(Math.random() * candies.length);
					const chosenCandy = candies[index];
					candy.src = `/candies/${chosenCandy}.png`;
				}
			}
		}
	}
}
