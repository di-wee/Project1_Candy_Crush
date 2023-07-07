let container = document.querySelector('.container');
let candies = ['Blue', 'Green', 'Orange', 'Purple', 'Red', 'Yellow'];

//game logic:

function gameInit() {
	genGrid();
}

function genGrid() {
	for (let i = 1; i < 7; i++) {
		for (let j = 1; j < 7; j++) {
			const div = document.createElement('div');
			div.className = `${i}-${j}`;
			div.setAttribute('style', `grid-area:${i}/${j}/${i}/${j}`);
			const index = Math.floor(Math.random() * candies.length);
			const chosenCandy = candies[index];
			const imgEl = document.createElement('img');
			imgEl.src = `/candies/${chosenCandy}.png`;
			div.appendChild(imgEl);
			container.appendChild(div);
		}
	}
}

genGrid();
