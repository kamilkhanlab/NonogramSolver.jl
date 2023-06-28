using NonogramSolver
using Test

rowClues = [[1,1], [1,1], Int[], [1,2], [3]]
colClues = [[1], [2,1], [1], [2,2], [1]]

@testset "NonogramSolver.jl" begin
    @test solve_puzzle(Puzzle(rowClues, colClues); verbosity=0).z ==
        [0 1 0 1 0; 0 1 0 1 0; 0 0 0 0 0; 1 0 0 1 1; 0 1 1 1 0]
end
