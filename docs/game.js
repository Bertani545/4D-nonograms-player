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
let dimSizes;
let dimsUsed;
let dims;
let currIdx;

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

function buildGrid(container, x, y, data) {
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			const btn = document.createElement("button");
			btn.className = "cell"
			btn.dataset.state = -1; // start at -1
			btn.addEventListener('pointerdown', (e) => {
				if (e.pointerType === 'touch') {
					handleTap(btn, j, i);
				} else if (e.pointerType === "mouse") {
					if (e.button === 0) {
						handleLeftClick(btn, j, i);
					} else if (e.button === 2) {
						handleRightClick(btn, j, i);
					} 
				} else{
					return;
				}

			})


			btn.addEventListener("contextmenu", e => {
			  e.preventDefault();
			});
			if (data[i][j] == 1){
				btn.style.backgroundColor = 'black';
				btn.dataset.state = 1;
			}
			if (data[i][j] == 0) {
				btn.classList.add('red-cross');
				btn.style.backgroundColor = 'white';
				btn.dataset.state = 0;
			}

			//let w = 100 * 10 / y;
			//let h = 100 * 10 / x;
			//btn.style.width = w + "%";
			//btn.style.height = h + "%";
			container.appendChild(btn);
		}
		
		container.style.gridTemplateColumns = "repeat(" + y + ", 1fr)";
		container.style.gridTemplateRows = "repeat(" + x + ", 1fr)";

	}
}



function handleLeftClick(self, r, c) {
	self.classList.remove('red-cross');
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
		self.style.backgroundColor = 'white';
		self.classList.add('red-cross');
		self.dataset.state = 0;
		updateBoard(r,c, 0);

	} else {
		self.style.backgroundColor = 'white';
		self.classList.remove('red-cross');
		self.dataset.state = -1;
		updateBoard(r,c, -1);
	}
}

//dimsUsed
//currIdx
function updateBoard(r, c, color) {
	
	currIdx.set(dimsUsed[0], r);
	currIdx.set(dimsUsed[1], c);

	const sameNSquares = NonogramModule.paintCell(currIdx, color);
	

	// Get lines
	// set the others
	for (let d = 0; d < 2; d++) {
		const dim = dimsUsed[d];
		const ans = NonogramModule.getHintsStatus(dim, currIdx);
		const isMod = ans[0];
		const status = vectorToArray(ans[1]);
		let numbers;
		if (d == 0) {
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
	if (self.dataset.state == -1) {
		self.style.backgroundColor = 'black';
		self.dataset.state = 1;
		updateBoard(r,c, 1);

	} else if (self.dataset.state == 1) {
		self.style.backgroundColor = 'white';
		self.classList.add('red-cross');
		self.dataset.state = 0;
		updateBoard(r,c, 0);
	} else {
		self.style.backgroundColor = 'white';
		self.classList.remove('red-cross');
		self.dataset.state = -1;
		updateBoard(r,c, -1);
	}
}


function buildBoard(place, x, y, data) {
	const container =  document.createElement("div");
	container.className = "game-container";



	function checkOrientation() {
		const container = document.getElementsByClassName('game-container')[0];
		if (window.innerWidth > window.innerHeight) {
		    const numberSize = 5;
		    const blocksize = 6;

		    container.style.height = blocksize * dims[dimsUsed[1]] + numberSize + "dvh";
		    container.style.width = blocksize * dims[dimsUsed[0]] + numberSize + "dvh";
		    

		    container.style.gridTemplateRows = numberSize  * Math.ceil(dims[dimsUsed[1]]/2) + "dvh " + blocksize * dims[dimsUsed[1]] + "dvh";
			container.style.gridTemplateColumns = numberSize  * Math.ceil(dims[dimsUsed[0]]/2) + "dvh " + blocksize * dims[dimsUsed[0]] + "dvh";

		} else {
			console.log("Portrait")
			const numberSize = 5;
			const blocksize = 6;

		    container.style.width = blocksize * dims[dimsUsed[0]] + numberSize + "dvw";
		    container.style.height = blocksize * dims[dimsUsed[1]] + numberSize + "dvw";
		    

		    container.style.gridTemplateRows =  numberSize  * Math.ceil(dims[dimsUsed[1]]/2)  + "dvw " + blocksize * dims[dimsUsed[1]] + "dvw";
			container.style.gridTemplateColumns = numberSize  * Math.ceil(dims[dimsUsed[0]]/2) + "dvw " + blocksize * dims[dimsUsed[0]] + "dvw";
		}
	}


	// Detect changes on resize
	window.addEventListener('resize', checkOrientation);
	

	place.appendChild(container);
	checkOrientation();

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
	buildGrid(board, y, x, data);
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


function placeNumbers(section, solveDim, movingDim, idx) {

	const sectionChildren = section.children;

	for (let i = 0; i < section.children.length; i++) {
		idx.set(movingDim, i);
		const linehints = NonogramModule.getHint(solveDim, idx);
		placeNumbersLine(sectionChildren[i], vectorToArray(linehints));
	}

	
}




function main() {

	dims = JSON.parse(sessionStorage.getItem("dims"));
	if (dims == undefined) {
		window.location.href = "index.html";
	}
	dims = dims.filter((x) => {return x >= 2})
	console.log(dims)
	if(dims.length < 2) {
		console.log("Wrong input")
		return;
		
	}
	let dimsC = new NonogramModule.VectorInt();

	for (let e of dims) {
		dimsC.push_back(e);
	}
	NonogramModule.createNonogram(dimsC);

	const boardArea = document.getElementById("playArea");
	

	const changeButton = document.getElementById("change-play-area");
	changeButton.addEventListener("click", (e) => {
		const bestBoard = NonogramModule.getBestBoard();
		console.log(bestBoard)
		const def = bestBoard[0];
		const idx = def[1];
		const boardDims = def[0];
		const data = vectorVectorToArrayArray(bestBoard[1]);

		dimsUsed = def[0];
		currIdx = def[1];

		// Build it
		boardArea.innerHTML = "";
		console.log("New fetched")
		boardData = buildBoard(boardArea, dims[boardDims[0]], dims[boardDims[1]], data);
		//console.log("Built")
		//console.log(boardData);

		// Build hints
		placeNumbers(boardData.NumbersTop, boardDims[1], boardDims[0], idx);
		placeNumbers(boardData.NumbersLeft, boardDims[0], boardDims[1], idx);
		//console.log("Placed hints")

		for (let i = 0; i < boardData.NumbersLeft.children.length; i++) {
				let temp = new NonogramModule.VectorInt();

				for (let d = 0; d < dimsC.size(); d++) {
					if (d == boardDims[0]) temp.push_back(0); // Random
					else if (d == boardDims[1]) temp.push_back(i);
					else temp.push_back(idx.get(d));

				}

				const ans = NonogramModule.getHintsStatus(boardDims[0], temp); // 0

				const isMod = ans[0];
				const status = vectorToArray(ans[1]);

				//console.log(status)

				if (isMod == 1) {
					boardData.NumbersLeft.children[i].classList.remove('unmod');
					boardData.NumbersLeft.children[i].classList.add('modifiable');
				} else {
					boardData.NumbersLeft.children[i].classList.add('unmod');
					boardData.NumbersLeft.children[i].classList.remove('modifiable');
				}
				let j = 0;
				for (let num of boardData.NumbersLeft.children[i].children) {
					if (num.innerHTML == "") continue;
					if (status[j] == 1) {
						num.classList.add('solved');
					} else {
						num.classList.remove('solved');
					}
					j++;
				}
			}

			for (let i = 0; i < boardData.NumbersTop.children.length; i++) {
				let temp = new NonogramModule.VectorInt();
				for (let d = 0; d < dimsC.size(); d++) {
					if (d == boardDims[1]) temp.push_back(0); // Random
					else if (d == boardDims[0]) temp.push_back(i);
					else temp.push_back(idx.get(d));
				}
				const ans = NonogramModule.getHintsStatus(boardDims[1], temp);

				const isMod = ans[0];
				const status = vectorToArray(ans[1]);

				//console.log(isMod)

				if (isMod == 1) {
					boardData.NumbersTop.children[i].classList.remove('unmod');
					boardData.NumbersTop.children[i].classList.add('modifiable');
				} else {
					boardData.NumbersTop.children[i].classList.add('unmod');
					boardData.NumbersTop.children[i].classList.remove('modifiable');
				}

				let j = 0;
				for (let num of boardData.NumbersTop.children[i].children) {
					if (num.innerHTML == "") continue;
					if (status[j] == 1) {
						num.classList.add('solved');
					} else {
						num.classList.remove('solved');
					}
					j++;
				}
			}
	});
	changeButton.click();
	//console.log(":)")
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
