#include<iostream>
#include<vector>
#include<string>
#include <sstream>
#include <queue>
#include<set>
#include<algorithm>
#include"nonogram.hpp"
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>

using namespace std;

//emcc main.cpp -o test2/main.js -s MODULARIZE=1 -s EXPORT_NAME="createModule" --bind -s ENVIRONMENT='web' -s EXPORT_ES6=1

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif


//EXTERN EMSCRIPTEN_KEEPALIVE



Nonogram nonogram;


bool paintCell(vector<int> idx, int color) {
	bool sameNumber = nonogram.paintCell(idx, static_cast<Color>(color));

	return sameNumber;
}

pair<int, vector<int>> getHintsStatus(int dim, vector<int> idx) {
	struct LineDef def = {dim, idx};

	int isMod = nonogram.lineCanBeModified(def);
	vector<HintState> states = nonogram.lineHintsArePlaced(def);
	vector<int> status;
	std::transform(states.begin(), states.end(),
                   std::back_inserter(status), // Appends to double_vector
                   [](HintState i) { return static_cast<int>(i); });
	pair<int, vector<int>> ans  = {isMod, status};
	return ans;
}

vector<vector<int>> getHints(int dim) {
	return nonogram.getHintsdim(dim);
}

bool isSolved() {
	return nonogram.userSolvedIt();
}


void createNonogram(vector<int> dims) {
	nonogram.buildRandom(dims.size(), dims, 0.5);
	cout << "Ready" << endl;
}


EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("paintCell", &paintCell);
    emscripten::function("getHintsStatus", &getHintsStatus);
    emscripten::function("isSolved", &isSolved);
    emscripten::function("createNonogram", &createNonogram);
    emscripten::function("getHints", &getHints);

    // STL types you want to pass between JS and C++
    emscripten::register_vector<int>("VectorInt");
    emscripten::register_vector<std::string>("VectorString");
    emscripten::register_vector<std::vector<int>>("VectorVectorInt");

    // Register pair<bool, vector<bool>>
    emscripten::value_array<std::pair<int, std::vector<int>>>("BoolVecPair")
        .element(&std::pair<int, std::vector<int>>::first)
        .element(&std::pair<int, std::vector<int>>::second);
}


int main()
{

	return 0;

}