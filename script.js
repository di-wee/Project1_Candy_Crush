//defining global variables
const container = document.querySelector('.container');
const candies = ['Blue', 'Green', 'Orange', 'Purple', 'Red', 'Yellow'];
let pickedCandy;
let swoppedCandy;
let score = 0;
const scoreP = document.querySelector('.score');
let moves = 5;
const moveP = document.querySelector('.move');
let highScore = 0;
const highScoreEl = document.querySelector('.HS');
let totalRows = 5;
let totalColumn = 5;
let grid = [];
const refresh = document.querySelector('.refresh');
const modal = document.querySelector('.modal');
const buttonOk = document.querySelector('#playagain');
const instructionModal = document.querySelector('.instruction-modal');

//on load, game grid will be generated and existing rows of candies will be crushed and cascaded and repopulated
window.addEventListener('load', function () {
	//retrieving previous high score from storage
	const HSMem = localStorage.getItem('highscore');
	if (HSMem === null) {
		highScoreEl.innerHTML = `High-score: ${highScore}`;
		instructionModal.style.display = 'block';
		window.addEventListener('click', function (e) {
			if (e.target == instructionModal) {
				instructionModal.style.display = 'none';
			}
		});
	} else {
		highScoreEl.innerHTML = `High-score: ${HSMem}`;
		highScore = HSMem;
	}
	gameInit();
	window.setInterval(function () {
		crushCandies();
		repopulateCandies();
	}, 200);
});

refresh.addEventListener('click', function () {
	localStorage.clear();
	highScore = 0;
	highScoreEl.innerHTML = `High-score: ${highScore}`;
});

//to initialise game by generating game grid and implementing event listeners
function gameInit() {
	genGrid();
	eventListener();
	score = 0;
}

function genGrid() {
	for (let i = 1; i < totalRows + 1; i++) {
		let rows = [];
		for (let j = 1; j < totalColumn + 1; j++) {
			const div = document.createElement('div');
			div.className = 'candies';
			//generating divs via grid in css using for loop above
			div.setAttribute('style', `grid-area:${i}/${j}/${i}/${j}`);
			const index = Math.floor(Math.random() * candies.length);
			const chosenCandy = candies[index];
			const imgEl = document.createElement('img');
			imgEl.src = `/candies/${chosenCandy}.png`;
			//class name  given for easy access of candies img later
			imgEl.className = `${i}-${j}`;
			div.appendChild(imgEl);
			container.appendChild(div);
			rows.push(imgEl);
		}
		grid.push(rows);
	}
	//candies element now pushed to into an array to be accessed directly
	console.log(grid);
}

//event listeners
function eventListener() {
	container.addEventListener('dragstart', dragStart);
	container.addEventListener('dragover', dragOver);
	container.addEventListener('dragenter', dragEnter);
	container.addEventListener('dragleave', dragLeave);
	container.addEventListener('drop', dragDrop);
	container.addEventListener('dragend', dragEnd);
	crushCandies();

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
	//functions to be implemented after candy is dragged:
	function dragEnd() {
		//converting candies class into array for manipulation later
		const pickedArr = pickedCandy.className.split('-'); //return ['index', '1', '1']
		const pickedRow = Number(pickedArr[0]); // convert string into number
		const pickedColumn = Number(pickedArr[1]);
		const swopArr = swoppedCandy.className.split('-');
		const swoppedRow = Number(swopArr[0]);
		const swoppedColumn = Number(swopArr[1]);
		moves -= 1;
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

		//to be able to swop candies right => pickedCandy has to be [r/c] and swoppedCandy has to be  is [r/ c+1]
		const swopRight =
			pickedRow === swoppedRow && swoppedColumn === pickedColumn + 1;

		//to be able to swop candies right => pickedCandy has to be [r/c] and swoppedCandy has to be  is [r/ c-01]
		const swopLeft =
			pickedRow === swoppedRow && swoppedColumn === pickedColumn - 1;

		//to be able to swop candies top => swoppedCandy has to be [r/c] and pickedCandy has to be  is [r-1/c]
		const swopTop =
			swoppedRow === pickedRow - 1 && swoppedColumn === pickedColumn;

		//to be able to swop candies bottom => swoppedCandy has to be [r/c] and pickedCandy has to be  is [r+1/c]
		const swopBottom =
			swoppedRow === pickedRow + 1 && swoppedColumn === pickedColumn;

		const checkAdjacent = swopRight || swopLeft || swopTop || swopBottom;

		//checking if  candies are adjacent to swop
		if (checkAdjacent) {
			swopCandies();
		}

		let checkValid = isValid();

		//checking if moves are valid to swop
		if (!checkValid) {
			swopCandies();
		}
	}
}

//check for valid move
function isValid() {
	for (let r = 0; r < totalRows; r++) {
		for (let c = 0; c < totalColumn - 2; c++) {
			const candy1 = grid[r][c];
			const candy2 = grid[r][c + 1];
			const candy3 = grid[r][c + 2];
			if (
				candy1.src == candy2.src &&
				candy2.src == candy3.src &&
				candy1.src.includes('.png')
			) {
				return true;
			}
		}
	}
	for (let r = 0; r < totalRows - 2; r++) {
		for (let c = 0; c < totalColumn; c++) {
			const candy1 = grid[r][c];
			const candy2 = grid[r + 1][c];
			const candy3 = grid[r + 2][c];
			if (
				candy1.src == candy2.src &&
				candy2.src == candy3.src &&
				candy1.src.includes('.png')
			) {
				return true;
			}
		}
	}
	return false;
}

//crush candies mechanic
function crushCandies() {
	crush4Candies();
	crush3Candies();
	cascadeCandies();
	repopulateCandies();
	scoreP.innerHTML = `Score: ${score}`;
	moveP.innerHTML = `Moves left: ${moves}`;
	gameOver();

	// crush5Candies();
}

function crush3Candies() {
	//horizontalcrush
	for (let r = 0; r < totalRows; r++) {
		for (let c = 0; c < totalColumn - 2; c++) {
			const candy1 = grid[r][c];
			const candy2 = grid[r][c + 1];
			const candy3 = grid[r][c + 2];
			if (
				candy1.src == candy2.src &&
				candy2.src == candy3.src &&
				candy1.src.includes('.png')
			) {
				candy1.src = '';
				candy2.src = '';
				candy3.src = '';
				score += 100;
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
			if (
				candy1.src == candy2.src &&
				candy2.src == candy3.src &&
				candy1.src.includes('.png')
			) {
				//if candies get crushed .src = blank
				candy1.src = '';
				candy2.src = '';
				candy3.src = '';
				score += 100;
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
			const candy = grid[r][c];
			if (!candy.src.includes('.png')) {
				const index = Math.floor(Math.random() * candies.length);
				const chosenCandy = candies[index];
				candy.src = `/candies/${chosenCandy}.png`;
			}
		}
	}
}

function crush4Candies() {
	//horizontal crush
	for (let r = 0; r < totalRows; r++) {
		for (let c = 0; c < totalColumn - 3; c++) {
			const candy1 = grid[r][c];
			const candy2 = grid[r][c + 1];
			const candy3 = grid[r][c + 2];
			const candy4 = grid[r][c + 3];
			if (
				candy1.src == candy2.src &&
				candy2.src == candy3.src &&
				candy3.src == candy4.src &&
				candy1.src.includes('.png')
			) {
				candy1.src = '';
				candy2.src = '';
				candy3.src = '';
				candy4.src = '';
				score += 160;
			}
		}
	}
	//verticalcrush
	for (let r = 0; r < totalRows - 3; r++) {
		for (let c = 0; c < totalColumn; c++) {
			if (r === 5) break;
			const candy1 = grid[r][c];
			const candy2 = grid[r + 1][c];
			const candy3 = grid[r + 2][c];
			const candy4 = grid[r + 3][c];
			if (
				candy1.src == candy2.src &&
				candy2.src == candy3.src &&
				candy3.src == candy4.src &&
				candy1.src.includes('.png')
			) {
				candy1.src = '';
				candy2.src = '';
				candy3.src = '';
				candy4.src = '';
				score += 160;
			}
		}
	}
}

//game over modal pop up
function gameOver() {
	if (moves === 0) {
		modal.style.display = 'block';
		//storing high score into memory
		if (score > highScore) {
			highScore = score;
			localStorage.setItem('highscore', highScore);
		}

		buttonOk.addEventListener('click', function () {
			location.reload();
		});
	}
}
