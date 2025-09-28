import createModule from './nonogram/main.js'

const ln = [[3,3],[2,1,3], [1,2,3], [1,1,1],[3,1,1],[3,1,1],[5,1],[2,2,2],[2,1],[2,1]];
const tn = [[1,1,1],[1,5],[4,2,2],[1,1,1,1],[1,1,2],[1,6],[1],[6,1],[3,2],[2,2]];
const data = [0,0,1,1,1,0,0,1,1,1,
			  0,1,1,0,0,1,0,1,1,1,
			  1,0,1,1,0,0,1,1,1,0,
			  0,0,1,0,0,0,0,1,0,1,
			  0,0,0,1,1,1,0,1,0,1,
			  1,1,1,0,0,1,0,1,0,0,
			  0,1,1,1,1,1,0,0,1,0,
			  1,1,0,0,1,1,0,1,1,0,
			  0,1,1,0,0,1,0,0,0,0,
			  0,1,1,0,0,1,0,0,0,0];


let NonogramModule;
let boardData;

function makeNumbersTop(element, nDivs, nNumbers) {
	for (let i = 0; i < nDivs; i++) {
		const division = document.createElement("div");
		division.className = "numbers-container";

		let size = 100 / nDivs;
		division.style.height = "100%"; 
		division.style.width = size + "%";
		division.style.display = 'flex';
		division.style.flexDirection = 'column';

		for (let j = 0; j < nNumbers; j++) {
			const numberBlock = document.createElement("div");
			numberBlock.className = "number-block";
			numberBlock.style.width = '100%';
			let size = 100 / nNumbers;
			numberBlock.style.height = size + "%"; 
			division.appendChild(numberBlock);

		}
		element.appendChild(division);
	}

}

function makeNumbersLeft(element, nDivs, nNumbers) {
	for (let i = 0; i < nDivs; i++) {
		const division = document.createElement("div");
		division.className = "numbers-container";

		let size = 100 / nDivs;
		division.style.height = size + "%"; 
		division.style.width = "100%";
		division.style.display = 'flex';
		for (let j = 0; j < nNumbers; j++) {
			const numberBlock = document.createElement("div");
			numberBlock.className = "number-block";
			numberBlock.style.height = '100%';
			let size = 100 / nNumbers;
			numberBlock.style.width = size + "%";
			division.appendChild(numberBlock);
		}
		element.appendChild(division);
	}

}

function buildGrid(container, x, y) {
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			const btn = document.createElement("button");
			btn.className = "cell"
			btn.dataset.state = -1; // start at -1
			btn.addEventListener("mousedown", e => {
			  if (e.button === 0) {
				    handleLeftClick(btn, j, i);
			  } else if (e.button === 2) {
			    	handleRightClick(btn, j, i);
			  } 
			});

			btn.addEventListener("touchend", e => {
			  handleTap(btn, i, j);
			});

			btn.addEventListener("contextmenu", e => {
			  e.preventDefault();
			});

			let w = 100 / y;
			let h = 100 / x;
			btn.style.width = w + "%";
			btn.style.height = h + "%";
			container.appendChild(btn);
		}
		container.appendChild(document.createElement("br"));
	}
}



function handleLeftClick(self, r, c) {
	if (self.dataset.state != 1) {
		self.style.backgroundColor = 'black'
		self.dataset.state = 1;
		updateBoard(r, c, 1);
	} else {
		self.style.backgroundColor = 'white'
		self.dataset.state = -1;
		updateBoard(r, c, -1);
	}


}

function handleRightClick(self, r, c, status) {
	if (self.dataset.state != 0) {
		self.style.backgroundColor = 'red';
		self.dataset.state = 0;
		updateBoard(r,c, 0);

	} else {
		self.style.backgroundColor = 'white';
		self.dataset.state = -1;
		updateBoard(r,c, -1);
	}
}

// r and c are known dimensions
const dimsUsed = [[0,"left"], [1,"top"]];
function updateBoard(r, c, color) {
	let idx = new NonogramModule.VectorInt();
	idx.push_back(r);
	idx.push_back(c);
	// Push back the others
	const sameNSquares = NonogramModule.paintCell(idx, color);
	

	// Get lines
	// set the others
	for (let dim of dimsUsed) {
  		const ans = NonogramModule.getHintsStatus(dim[0], idx);

  		const isMod = ans[0];
  		const status = vectorToArray(ans[1]);

  		console.log(status)
  		let numbers;
  		if (dim[1] == "left") {
  			numbers = boardData.NumbersLeft.children[c];
  			if (isMod == 1) {
  				numbers.classList.remove('unmod');
  				numbers.classList.add('modifiable');
  			} else {
  				numbers.classList.add('unmod');
  				numbers.classList.remove('modifiable');
  			}
  		}else {
  			numbers = boardData.NumbersTop.children[r];
  			if (isMod == 1) {
  				numbers.classList.remove('unmod');
  				numbers.classList.add('modifiable');
  			} else {
  				numbers.classList.add('unmod');
  				numbers.classList.remove('modifiable');
  			}
  		}

  		let i = 0;
  		for (let num of numbers.children) {
  			if (num.innerHTML == "") continue;
  			if (status[i] == 1) {
  				num.classList.add('solved');
  			} else {
  				num.classList.remove('solved');
  			}
  			i++;
  		}
  		
	}

	if (sameNSquares == 1) {
		if (NonogramModule.isSolved()) {
			setTimeout(() => {
			  alert('You did it!');
			  console.log("Yeih!")
			}, 100);
				
		}
	}
}

function handleTap(self, r, c) {

}


function buildBoard(place, x, y, Module) {
	const container =  document.createElement("div");
	container.className = "game-container";
	place.appendChild(container);

	const numbersTop = document.createElement("div");
	numbersTop.className = "top-numbers";
	let nNumbersTop = Math.ceil(y/2);
	makeNumbersTop(numbersTop, x, nNumbersTop);

	const numbersLeft = document.createElement("div");
	numbersLeft.className = "left-numbers";
	let nNumbersLeft = Math.ceil(x/2);
	makeNumbersLeft(numbersLeft, y, nNumbersLeft);

	const board = document.createElement("div");
	board.className = "board";
	buildGrid(board, x, y);

	container.appendChild(numbersTop);
	container.appendChild(numbersLeft);
	container.appendChild(board);


	return {
		NumbersTop: numbersTop,
		NumbersLeft: numbersLeft,
		Board: board
	};
}


function placeNumbersLine(line, numbers) {

	const blocks = line.children;
	let i = 0;
	let j = blocks.length - 1;
	j -= numbers.length - 1;
	while (i < numbers.length) {
		blocks[j].innerHTML = numbers[i];
		i++;
		j++;
	}
}


function placeNumbers(section, numbersGroup) {
	const n = numbersGroup.length;
	const sectionChildren = section.children;
	
	if (n != sectionChildren.length) return;
	for (let i = 0; i < n; i++) {
		placeNumbersLine(sectionChildren[i], numbersGroup[i])
	}
}


function main() {

	const dims = JSON.parse(sessionStorage.getItem("dims"));

	let dimsC = new NonogramModule.VectorInt();
	dimsC.push_back(dims[0]);
	dimsC.push_back(dims[1]);
	NonogramModule.createNonogram(dimsC);

	const boardArea = document.getElementById("playArea");
  	boardData = buildBoard(boardArea, dims[0], dims[1]);
  	
  	// Get the hitns
  	let nTop = vectorVectorToArrayArray(NonogramModule.getHints(1));
  	let nLeft = vectorVectorToArrayArray(NonogramModule.getHints(0));
  	console.log(nTop)
  	placeNumbers(boardData.NumbersTop, nTop);
  	placeNumbers(boardData.NumbersLeft, nLeft);

  	for (let i = 0; i < nLeft.length; i++) {
  		let temp = new NonogramModule.VectorInt();
		temp.push_back(0);
		temp.push_back(i);
  		const ans = NonogramModule.getHintsStatus(0, temp);

  		const isMod = ans[0];
  		const status = vectorToArray(ans[1]);

  		console.log(status)

  		if (isMod == 1) {
  			boardData.NumbersLeft.children[i].classList.remove('unmod');
  			boardData.NumbersLeft.children[i].classList.add('modifiable');
  		} else {
  			boardData.NumbersLeft.children[i].classList.add('unmod');
  			boardData.NumbersLeft.children[i].classList.remove('modifiable');
  		}
  	}

  	for (let i = 0; i < nTop.length; i++) {
  		let temp = new NonogramModule.VectorInt();
		temp.push_back(i);
		temp.push_back(0);
  		const ans = NonogramModule.getHintsStatus(1, temp);

  		const isMod = ans[0];
  		const status = vectorToArray(ans[1]);

  		console.log(isMod)

  		if (isMod == 1) {
  			boardData.NumbersTop.children[i].classList.remove('unmod');
  			boardData.NumbersTop.children[i].classList.add('modifiable');
  		} else {
  			boardData.NumbersTop.children[i].classList.add('unmod');
  			boardData.NumbersTop.children[i].classList.remove('modifiable');
  		}
  	}


  	console.log(":)")
}	



function setStatus(line) {
	getHintsStatus()
}


function vectorToArray(vec) {
    let arr = [];
    for (let i = 0; i < vec.size(); i++) arr.push(vec.get(i));
    return arr;
}

function vectorVectorToArrayArray(vecvec) {
	let arrVec = vectorToArray(vecvec);
	let arr = [];
    for (let i = 0; i < arrVec.length; i++) {
    	arr.push(vectorToArray(arrVec[i]));
    }
    return arr;
}

// We have to change the board size according to the number of swuares


createModule().then((Module) => {
    NonogramModule = Module;
    main();
});
