var documenterSearchIndex = {"docs":
[{"location":"library/#API-library","page":"API library","title":"API library","text":"","category":"section"},{"location":"library/","page":"API library","title":"API library","text":"Modules = [NonogramSolver]\nOrder = [:module, :function, :type]","category":"page"},{"location":"library/#NonogramSolver.NonogramSolver","page":"API library","title":"NonogramSolver.NonogramSolver","text":"Module for formulating nonogram puzzles (a.k.a. Picross, paint-by-number, and crucipixel), and for solving these puzzles in JuMP using integer linear programming.\n\n\n\n\n\n","category":"module"},{"location":"library/#NonogramSolver.eval_aux_quantities-Tuple{Puzzle}","page":"API library","title":"NonogramSolver.eval_aux_quantities","text":"eval_aux_quantities(p::Puzzle) -> AuxPuzzleQuantities\n\nConstruct intermediate quantities that describe a Puzzle p, to aid solve_puzzle.\n\n\n\n\n\n","category":"method"},{"location":"library/#NonogramSolver.read_puzzle_from_cwc-Tuple{String}","page":"API library","title":"NonogramSolver.read_puzzle_from_cwc","text":"read_puzzle_from_cwc(\"filename.cwc\") -> Puzzle\n\nImport a puzzle that was exported from Web Paint-by-Number as a .CWC file.\n\n\n\n\n\n","category":"method"},{"location":"library/#NonogramSolver.recover_aux_data-Tuple{AuxPuzzleQuantities}","page":"API library","title":"NonogramSolver.recover_aux_data","text":"recover_aux_data(p::AuxPuzzleQuantities)\n\nRecover a Tuple containing all fields of an AuxPuzzleQuantities object p.\n\n\n\n\n\n","category":"method"},{"location":"library/#NonogramSolver.solve_puzzle","page":"API library","title":"NonogramSolver.solve_puzzle","text":"solve_puzzle(p::Puzzle) -> PuzzleSolution\n\nsolve_puzzle(\n    p::Puzzle,\n    auxQs::AuxPuzzleQuantities = eval_aux_quantities(p);\n    optimizer = GLPK.Optimizer,\n    solverAttributes = (\"msg_lev\" => GLPK.GLP_MSG_OFF,),\n    verbosity::Int = 1\n) -> PuzzleSolution\n\nSolve the Puzzle p, and construct a corresponding PuzzleSolution.\n\nThis puzzle is solved according to a method by Khan, using an integer linear programming (ILP) solver in the optimization framework JuMP. If successful, returns one solution. Uses the freely available solver GLPK by default. All arguments other than p are optional.\n\nThe puzzle instance p may be constructed using either a Puzzle constructor or read_puzzle_from_cwc. The arguments optimizer and solverAttributes specify your choice of ILP solver and settings to JuMP, for use in JuMP's command:\n\nJuMP.optimizer_with_attributes(optimizer, solverAttributes...)\n\nSee JuMP's documentation for more details about setting up these inputs. \n\nReports JuMP's solution summary by default; set verbosity=0 to suppress this.\n\n\n\n\n\n","category":"function"},{"location":"library/#NonogramSolver.AuxPuzzleQuantities","page":"API library","title":"NonogramSolver.AuxPuzzleQuantities","text":"Holds intermediate quantities describing the Puzzle p.\n\nThese quantities are used by solve_puzzle to solve a puzzle. Quantities are named as in Khan's article (2022, doi:10.1109/TG.2020.3036687), and their purposes are described there.\n\nFields\n\nsigmaR::Array{Int, 2}: Spacing quantities for blocks in rows.\nsigmaC::Array{Int, 2}: Spacing quantities for blocks in columns.\nfSetR::Array{UnitRange{Int}, 2}: First-position sets for blocks in rows.\nfSetC::Array{UnitRange{Int}, 2}: First-position sets for blocks in columns.\noSetR::Array{UnitRange{Int}, 3}: Overlap-checking sets for blocks in rows.\noSetC::Array{UnitRange{Int}, 3}: Overlap-checking sets for blocks in columns.\nmSetR::Array{Vector{Int}, 2}: Monochrome index sets for rows.\nmSetC::Array{Vector{Int}, 2}: Monochrome index sets for columns.\nmaxBR::Int: Upper bound on number of blocks in each row.\nmaxBC::Int: Upper bound on number of blocks in each column.\n\n\n\n\n\n","category":"type"},{"location":"library/#NonogramSolver.Puzzle","page":"API library","title":"NonogramSolver.Puzzle","text":"Holds one puzzle instance.\n\nFields of Puzzle{T}\n\npalette: Iterable collection of the puzzle's permitted colors, each of type T. Lack of color is represented by zero(T), so zero(T) must be defined and must not be in palette.\nsR::Vector{Vector{Int}}: Numerical clues for each row, from top to bottom. Empty rows are entered as Int[] (and not e.g. [0]).\ncR::Vector{Vector{T}}: Colors in palette corresponding to the clues in sR.\nsC::Vector{Vector{Int}}: Numerical clues for each column, from left to right. Empty columns are entered as Int[].\ncC::Vector{Vector{T}}: Colors in palette corresponding to the clues in sC.\n\nNon-default constructors\n\nPuzzle(sR::Vector{Vector{Int}}, sC::Vector{Vector{Int}})\n\nHold a monochrome puzzle, with sR containing row clues and sC containing column clues.\n\nThis constructor sets the puzzle's single color (traditionally \"black\") to 1, lack of color (traditionally \"white\") to 0, and Puzzle.palette to 1:1.\n\nPuzzle(sR, cR, sC, cC)\n\nBuild Puzzle.palette from cR and cC; otherwise identical to the default constructor.\n\nSee also read_puzzle_from_cwc.\n\n\n\n\n\n","category":"type"},{"location":"library/#NonogramSolver.PuzzleSolution","page":"API library","title":"NonogramSolver.PuzzleSolution","text":"Holds JuMP's termination status after a solution attempt, and the solution itself if successful.\n\nFields\n\njumpTerminationStatus: the eventual output of JuMP.termination_status, indicating the outcome of the solution attempt.\nz::Matrix{T}: Spatial array of cell colors (of type T) in solution, if successful.\npalette::P: Collection of possible cell colors (each of type T). Does not include lack of color, which is indicated as zero(T).\n\n\n\n\n\n","category":"type"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = NonogramSolver","category":"page"},{"location":"#NonogramSolver.jl","page":"Home","title":"NonogramSolver.jl","text":"","category":"section"},{"location":"#Overview","page":"Home","title":"Overview","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This is a Julia module for formulating nonogram puzzles (a.k.a. Picross, paint-by-number, and crucipixel), and for solving these puzzles using integer linear programming (ILP) via JuMP. A new effective ILP formulation by Khan is employed. Monochrome and multicolored puzzles are both supported.","category":"page"},{"location":"","page":"Home","title":"Home","text":"If you make use of this implementation in your own work, please cite the accompanying article:","category":"page"},{"location":"","page":"Home","title":"Home","text":"Kamil A. Khan, Solving nonograms using integer programming without coloring, IEEE Transactions on Games, 14(1): 56-63, 2022. doi:10.1109/TG.2020.3036687","category":"page"},{"location":"","page":"Home","title":"Home","text":"This solution approach has also been implemented in GAMS.","category":"page"},{"location":"#Puzzle-description","page":"Home","title":"Puzzle description","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The following figure depicts a simple instance of a monochrome puzzle  (left) and its unique solution (right).","category":"page"},{"location":"","page":"Home","title":"Home","text":"<table border=\"0\"><tr>\n<td>\n\t<figure>\n\t\t<img src='examplePrompt.png' style=\"width: 200px\" alt='Simple\n\t\tmonochrome puzzle'>\n\t</figure>\n</td>\n<td>\n\t<figure>\n\t\t<img src='exampleSolution.png' style=\"width: 200px\" alt='Puzzle solution'>\n\t</figure>\n</td>\n</tr></table>","category":"page"},{"location":"","page":"Home","title":"Home","text":"The goal of this puzzle is to color each cell in the grid either filled/black or unfilled/white, consistently with both the row clues to the left and the column clues above the puzzle. Each clue number indicates a series of contiguous black cells in that row/column, in the specified order. For example, the row clues for the 4th row (\"1 2\") indicate that the 4th row of the solved puzzle must contain the following, from left to right:","category":"page"},{"location":"","page":"Home","title":"Home","text":"any number of white cells,\nthen 1 black cell,\nthen at least 1 white cell,\nthen 2 black cells,\nthen any number of white cells.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The column clues are analogous, and describe the column's contents from top to bottom. The \"empty\" clue for the 3rd row indicates that this row must contain no black cells at all.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Simple puzzles may be solved by line solving, which involves deducing as much as possible about the cells in a single row (or column) using only that row's numerical clues, along with any known colors of that row's cells. \"Real-world\" instances are often deliberately designed so that line solving is particularly effective.","category":"page"},{"location":"","page":"Home","title":"Home","text":"However, in general this problem is NP-complete, and line solving may be completely useless, such as in the following example adapted from Greifer and Wolter:","category":"page"},{"location":"","page":"Home","title":"Home","text":"<figure>\n\t<img src='nDom.png' style=\"width: 300px\" alt='Difficult puzzle'>\n</figure>","category":"page"},{"location":"","page":"Home","title":"Home","text":"This puzzle instance has a unique solution (and we find it below), but it cannot be approached by line solving at all.","category":"page"},{"location":"","page":"Home","title":"Home","text":"In multicolored puzzles, the contiguous filled blocks in each row/column may instead have colors other than black. Thus, each clue number is colored with the color of the corresponding block. Successive blocks of different colors need not be separated by at least one white cell. Intuitively, multicolored puzzles are easier than analogous monochrome puzzles, because there are fewer \"red herring\" candidate solutions to eliminate.","category":"page"},{"location":"#Examples","page":"Home","title":"Examples","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Suppose we wish to solve the above puzzles in Julia. Begin by loading the module. With NonogramSolver.jl in your working directory, enter the following commands in Julia's REPL, typing Enter at the end of each command:","category":"page"},{"location":"","page":"Home","title":"Home","text":"include(\"NonogramSolver.jl\")\nusing .NonogramSolver","category":"page"},{"location":"","page":"Home","title":"Home","text":"DocTestSetup = quote\n    include(\"../src/NonogramSolver.jl\")\n\tusing .NonogramSolver\nend","category":"page"},{"location":"","page":"Home","title":"Home","text":"Let's first tackle the simpler puzzle above. Store the row clues as a Vector{Vector{Int}}, and store the column clues as another Vector{Vector{Int}}:","category":"page"},{"location":"","page":"Home","title":"Home","text":"rowClues = [[1,1], [1,1], Int[], [1,2], [3]]\ncolClues = [[1], [2,1], [1], [2,2], [1]]","category":"page"},{"location":"","page":"Home","title":"Home","text":"(In this representation, the empty 3rd row of clues is indicated as an empty Vector{Int}, which is denoted in Julia as Int[].) Then, set up a corresponding Puzzle object:","category":"page"},{"location":"","page":"Home","title":"Home","text":"simplePuzzle = NonogramSolver.Puzzle(rowClues, colClues)","category":"page"},{"location":"","page":"Home","title":"Home","text":"...and solve it with solve_puzzle. This sets up an ILP formulation by Khan, and then solves it using the freely available ILP solver GLPK in JuMP by default:","category":"page"},{"location":"","page":"Home","title":"Home","text":"simpleSolution = NonogramSolver.solve_puzzle(simplePuzzle; verbosity=0)","category":"page"},{"location":"","page":"Home","title":"Home","text":"(If you have access to other ILP solvers such as GUROBI or CPLEX, then you may direct solve_puzzle to use these instead.) In Julia's REPL, the above line produces an output that looks like:","category":"page"},{"location":"","page":"Home","title":"Home","text":"<blockquote>\n⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F; <br/>\n⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F; <br/>\n⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F; <br/>\n⬛&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬛&#xFE0F; <br/>\n⬜&#xFE0F;⬛&#xFE0F;⬛&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;\n</blockquote>","category":"page"},{"location":"","page":"Home","title":"Home","text":"Without verbosity=0, we would also see some of JuMP's performance statistics. This solution may also be: ","category":"page"},{"location":"","page":"Home","title":"Home","text":"displayed using @show simpleSolution, or \nretrieved as a String with repr(simpleSolution), or \nextracted as a Matrix of 1s and 0s as simpleSolution.z, which is:\n5×5 Matrix{Int64}:\n 0  1  0  1  0\n 0  1  0  1  0\n 0  0  0  0  0\n 1  0  0  1  1\n 0  1  1  1  0","category":"page"},{"location":"","page":"Home","title":"Home","text":"With NonogramSolver.jl already included, we may repeat the above procedure for the second, trickier example above. This looks as follows in the REPL:","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> rowClues = [[3], [1], [3,1], [1], [3,1], [1], [3,1], [1], [1]]\n9-element Vector{Vector{Int64}}:\n [3]\n [1]\n [3, 1]\n [1]\n [3, 1]\n [1]\n [3, 1]\n [1]\n [1]\n\njulia> colClues = [[1], [1], [1,3], [1], [1,3], [1], [1,3], [1], [3]]\n9-element Vector{Vector{Int64}}:\n [1]\n [1]\n [1, 3]\n [1]\n [1, 3]\n [1]\n [1, 3]\n [1]\n [3]\n\njulia> trickyPuzzle = NonogramSolver.Puzzle(rowClues, colClues);\n\njulia> NonogramSolver.solve_puzzle(trickyPuzzle; verbosity=0)\n\n⬜⬜⬜⬜⬜⬜⬛⬛⬛\n⬜⬜⬜⬜⬜⬜⬜⬜⬛\n⬜⬜⬜⬜⬛⬛⬛⬜⬛\n⬜⬜⬜⬜⬜⬜⬛⬜⬜\n⬜⬜⬛⬛⬛⬜⬛⬜⬜\n⬜⬜⬜⬜⬛⬜⬜⬜⬜\n⬛⬛⬛⬜⬛⬜⬜⬜⬜\n⬜⬜⬛⬜⬜⬜⬜⬜⬜\n⬜⬜⬛⬜⬜⬜⬜⬜⬜","category":"page"},{"location":"","page":"Home","title":"Home","text":"That final output looks much better in the REPL itself, where it looks like:","category":"page"},{"location":"","page":"Home","title":"Home","text":"<blockquote>\n⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬛&#xFE0F;⬛&#xFE0F; <br/>\n⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F; <br/>\n⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬛&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬛&#xFE0F; <br/>\n⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬜&#xFE0F; <br/>\n⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬛&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬜&#xFE0F; <br/>\n⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F; <br/>\n⬛&#xFE0F;⬛&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F; <br/>\n⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F; <br/>\n⬜&#xFE0F;⬜&#xFE0F;⬛&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;⬜&#xFE0F;\n</blockquote>","category":"page"},{"location":"","page":"Home","title":"Home","text":"This is indeed the correct unique solution. For puzzles with multiple solutions, only one solution will be generated. If it's impossible to satisfy the row clues and column clues simultaneously, then no solution exists, and a completely white/unfilled grid will be produced to indicate this.","category":"page"},{"location":"#Importing-from-Web-Paint-by-Number","page":"Home","title":"Importing from Web Paint-by-Number","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Puzzles may also be imported from Web Paint-by-Number as follows:","category":"page"},{"location":"","page":"Home","title":"Home","text":"In Web Paint-by-Number's export form, specify the desired puzzle ID,  choose \".CWC file\" as the desired output format, and hit the Export button at the bottom.\nSave the exported text in your working directory, as e.g. puzzle.cwc.\nIn Julia, after importing this module and using .NonogramSolver, import the CWC file as a Puzzle object using read_puzzle_from_cwc:\npuzzle = read_puzzle_from_cwc(\"puzzle.cwc\")\nThen solve this puzzle:\npuzzleSolution = solve_puzzle(puzzle)","category":"page"}]
}
