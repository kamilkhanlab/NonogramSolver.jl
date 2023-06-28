"""
Module for formulating nonogram puzzles (a.k.a. Picross, paint-by-number, and crucipixel), and for solving these puzzles in JuMP using integer linear programming.
"""
module NonogramSolver

import JuMP, GLPK

export Puzzle, AuxPuzzleQuantities, PuzzleSolution

export read_puzzle_from_cwc,
    eval_aux_quantities,
    solve_puzzle,
    recover_aux_data

"""
Holds one puzzle instance.

# Fields of `Puzzle{T}`

- `palette`: Iterable collection of the puzzle's permitted colors, each of type `T`. Lack of color is represented by `zero(T)`, so `zero(T)` must be defined and must not be in `palette`.
- `sR::Vector{Vector{Int}}`: Numerical clues for each row, from top to bottom. Empty rows are entered as `Int[]` (and *not* e.g. `[0]`).
- `cR::Vector{Vector{T}}`: Colors in `palette` corresponding to the clues in `sR`.
- `sC::Vector{Vector{Int}}`: Numerical clues for each column, from left to right. Empty columns are entered as `Int[]`.
- `cC::Vector{Vector{T}}`: Colors in `palette` corresponding to the clues in `sC`.

# Non-default constructors

    Puzzle(sR::Vector{Vector{Int}}, sC::Vector{Vector{Int}})

Hold a monochrome puzzle, with `sR` containing row clues and `sC` containing column clues.

This constructor sets the puzzle's single color (traditionally "black") to `1`, lack of color (traditionally "white") to `0`, and `Puzzle.palette` to `1:1`.

    Puzzle(sR, cR, sC, cC)

Build `Puzzle.palette` from `cR` and `cC`; otherwise identical to the default constructor.

See also [`read_puzzle_from_cwc`](@ref).
"""
struct Puzzle{T}
    palette
    sR::Vector{Vector{Int}}
    cR::Vector{Vector{T}}
    sC::Vector{Vector{Int}}
    cC::Vector{Vector{T}}
end

function Puzzle(
    sR::Vector{Vector{Int}},
    sC::Vector{Vector{Int}}
)
    # label the single block color as 1
    palette = 1:1
    cR = [ones(Int, length(s)) for s in sR]
    cC = [ones(Int, length(s)) for s in sC]
    return Puzzle(palette, sR, cR, sC, cC)
end

Puzzle(sR, cR, sC, cC) = Puzzle(union(cR..., cC...), sR, cR, sC, cC)

"""
Holds intermediate quantities describing the [`Puzzle`](@ref) `p`.

These quantities are used by [`solve_puzzle`](@ref) to solve a puzzle. Quantities are named as in Khan's article (2022, doi:10.1109/TG.2020.3036687), and their purposes are described there.

# Fields

- `sigmaR::Array{Int, 2}`: Spacing quantities for blocks in rows.
- `sigmaC::Array{Int, 2}`: Spacing quantities for blocks in columns.
- `fSetR::Array{UnitRange{Int}, 2}`: First-position sets for blocks in rows.
- `fSetC::Array{UnitRange{Int}, 2}`: First-position sets for blocks in columns.
- `oSetR::Array{UnitRange{Int}, 3}`: Overlap-checking sets for blocks in rows.
- `oSetC::Array{UnitRange{Int}, 3}`: Overlap-checking sets for blocks in columns.
- `mSetR::Array{Vector{Int}, 2}`: Monochrome index sets for rows.
- `mSetC::Array{Vector{Int}, 2}`: Monochrome index sets for columns.
- `maxBR::Int`: Upper bound on number of blocks in each row.
- `maxBC::Int`: Upper bound on number of blocks in each column.
"""
struct AuxPuzzleQuantities
    sigmaR::Array{Int, 2}
    sigmaC::Array{Int, 2}
    fSetR::Array{UnitRange{Int}, 2}
    fSetC::Array{UnitRange{Int}, 2}
    oSetR::Array{UnitRange{Int}, 3}
    oSetC::Array{UnitRange{Int}, 3}
    mSetR::Array{Vector{Int}, 2}
    mSetC::Array{Vector{Int}, 2}
    maxBR::Int
    maxBC::Int
end

"""
    recover_aux_data(p::AuxPuzzleQuantities)

Recover a `Tuple` containing all fields of an [`AuxPuzzleQuantities`](@ref) object `p`.
"""
recover_aux_data(p::AuxPuzzleQuantities) = (
    p.sigmaR, p.sigmaC, p.fSetR, p.fSetC,
    p.oSetR, p.oSetC, p.mSetR, p.mSetC,
    p.maxBR, p.maxBC
)

"""
Holds JuMP's termination status after a solution attempt, and the solution itself if successful.

# Fields

- `jumpTerminationStatus`: the eventual output of `JuMP.termination_status`, indicating the outcome of the solution attempt.
- `z::Matrix{T}`: Spatial array of cell colors (of type `T`) in solution, if successful.
- `palette::P`: Collection of possible cell colors (each of type `T`). Does not include lack of color, which is indicated as `zero(T)`.
"""
struct PuzzleSolution
    jumpTerminationStatus
    z::Matrix
    palette
end

"""
    read_puzzle_from_cwc("filename.cwc") -> Puzzle

Import a puzzle that was exported from [Web Paint-by-Number](https://webpbn.com/export.cgi) as a .CWC file.
"""
function read_puzzle_from_cwc(cwcFilename::String)
    # initialize outside scope of "open"
    palette = 1:1
    
    sR = Vector{Int}[]
    cR = similar(sR)
    sC = similar(sR)
    cC = similar(cR)

    # read CWC file and store it in the above matrices
    open(cwcFilename, "r") do io
        nRows = parse(Int, readline(io))
        nColumns = parse(Int, readline(io))
        nColors = parse(Int, readline(io))
        palette = 1:nColors

        sR = [parse.(Int, split(readline(io))) for i in 1:nRows]
        readline(io)
        cR = [parse.(Int, split(readline(io))) for s in sR]
        readline(io)
        sC = [parse.(Int, split(readline(io))) for j in 1:nColumns]
        readline(io)
        cC = [parse.(Int, split(readline(io))) for s in sC]
    end

    return Puzzle(palette, sR, cR, sC, cC)
end

"""
    eval_aux_quantities(p::Puzzle) -> AuxPuzzleQuantities

Construct intermediate quantities that describe a [`Puzzle`](@ref) `p`, to aid [`solve_puzzle`](@ref).
"""
function eval_aux_quantities(puzzle::Puzzle)
    bR = length.(puzzle.sR) # number of blocks in each row
    maxBR = maximum(bR)
    bC = length.(puzzle.sC) # number of blocks in each column
    maxBC = maximum(bC)

    m = length(puzzle.sR) # number of puzzle rows
    n = length(puzzle.sC) # number of puzzle columns
    nColors = length(puzzle.palette)

    sigmaR = zeros(Int, m, maxBR)
    mSetR = Array{Vector{Int}}(undef, m, nColors)
    for (i, cRI) in enumerate(puzzle.cR)
        for t in 1:(bR[i] - 1)
            sigmaR[i,t] = (cRI[t] == cRI[t+1])
        end

        for (p, color) in enumerate(puzzle.palette)
            mSetR[i,p] = [t for (t,c) in enumerate(cRI) if (c == color)]
        end
    end

    sigmaC = zeros(Int, n, maxBC)
    mSetC = Array{Vector{Int}}(undef, n, nColors)
    for (j, cCJ) in enumerate(puzzle.cC)
        for t in 1:(bC[j] - 1)
            sigmaC[j,t] = (cCJ[t] == cCJ[t+1])
        end

        for (p, color) in enumerate(puzzle.palette)
            mSetC[j,p] = [t for (t,c) in enumerate(cCJ) if (c == color)]
        end
    end

    fSetR = Array{UnitRange{Int}}(undef, m, maxBR)
    oSetR = Array{UnitRange{Int}}(undef, m, maxBR, n)
    for (i, sRI) in enumerate(puzzle.sR)
        l = 1
        u = n + 1 - sum(sRI) - sum(sigmaR[i,:])
        for (t, s) in enumerate(sRI)
            fSetR[i,t] = l:u
            for j in 1:n
                oSetR[i,t,j] = intersect(l:u, (j-s+1):j)
            end
            deltaL = s + sigmaR[i,t]
            l += deltaL
            u += deltaL
        end
    end

    fSetC = Array{UnitRange{Int}}(undef, n, maxBC)
    oSetC = Array{UnitRange{Int}}(undef, n, maxBC, m)
    for (j, sCJ) in enumerate(puzzle.sC)
        l = 1
        u = m + 1 - sum(sCJ) - sum(sigmaC[j,:])
        for (t, s) in enumerate(sCJ)
            fSetC[j,t] = l:u
            for i in 1:m
                oSetC[j,t,i] = intersect(l:u, (i-s+1):i)
            end
            deltaL = s + sigmaC[j,t]
            l += deltaL
            u += deltaL
        end
    end
    
    return AuxPuzzleQuantities(
        sigmaR, sigmaC, fSetR, fSetC,
        oSetR, oSetC, mSetR, mSetC,
        maxBR, maxBC
    )
end

"""
    solve_puzzle(p::Puzzle) -> PuzzleSolution

    solve_puzzle(
        p::Puzzle,
        auxQs::AuxPuzzleQuantities = eval_aux_quantities(p);
        optimizer = GLPK.Optimizer,
        solverAttributes = ("msg_lev" => GLPK.GLP_MSG_OFF,),
        verbosity::Int = 1
    ) -> PuzzleSolution

Solve the [`Puzzle`](@ref) `p`, and construct a corresponding [`PuzzleSolution`](@ref).

This puzzle is solved according to a [method by Khan](https://doi.org/10.1109/TG.2020.3036687), using an integer linear programming (ILP) solver in the optimization framework JuMP. If successful, returns one solution. Uses the freely available solver GLPK by default. All arguments other than `p` are optional.

The puzzle instance `p` may be constructed using either a [`Puzzle`](@ref) constructor or [`read_puzzle_from_cwc`](@ref).
The arguments `optimizer` and `solverAttributes` specify your choice of ILP solver and settings to JuMP, for use in JuMP's command:

    JuMP.optimizer_with_attributes(optimizer, solverAttributes...)

See JuMP's documentation for more details about setting up these inputs. 

Reports JuMP's solution summary by default; set `verbosity=0` to suppress this.
"""
function solve_puzzle(
    p::Puzzle,
    auxQs::AuxPuzzleQuantities = eval_aux_quantities(p);
    optimizer = GLPK.Optimizer,
    solverAttributes = ("msg_lev" => GLPK.GLP_MSG_OFF,),
    verbosity::Int = 1
)
    # recover fields of p::Puzzle
    palette, sR, cR, sC, cC = p.palette, p.sR, p.cR, p.sC, p.cC

    # convenience labels
    rows = eachindex(sR)
    cols = eachindex(sC)
    colors = eachindex(palette)
    blocksR(i) = eachindex(sR[i])
    blocksC(j) = eachindex(sC[j])
    notLastBlockR(i) = 1:(length(sR[i]) - 1)
    notLastBlockC(j) = 1:(length(sC[j]) - 1)
    
    (sigmaR, sigmaC, fSetR, fSetC,
     oSetR, oSetC, mSetR, mSetC, maxBR, maxBC) = recover_aux_data(auxQs)

    # set up and solve equivalent integer linear program in JuMP 
    model = JuMP.Model(
        JuMP.optimizer_with_attributes(optimizer,
                                       solverAttributes...))
    
    JuMP.@variable(model, y[rows, 1:maxBR, cols], Bin)
    JuMP.@variable(model, x[cols, 1:maxBC, rows], Bin)

    JuMP.@constraint(model, beginOnceR[i in rows, t in blocksR(i)],
                     sum(y[i,t,j] for j in fSetR[i,t]) == 1)
    
    JuMP.@constraint(model, beginOnceC[j in cols, t in blocksC(j)],
                     sum(x[j,t,i] for i in fSetC[j,t]) == 1)

    JuMP.@constraint(model, orderR[i in rows, t in notLastBlockR(i)],
                     sR[i][t] + sigmaR[i,t] + sum(j*y[i,t,j] for j in fSetR[i,t])
                     <= sum(j*y[i,t+1,j] for j in fSetR[i,t+1]))
    
    JuMP.@constraint(model, orderC[j in cols, t in notLastBlockC(j)],
                     sC[j][t] + sigmaC[j,t] + sum(i*x[j,t,i] for i in fSetC[j,t])
                     <= sum(i*x[j,t+1,i] for i in fSetC[j,t+1]))
   
    JuMP.@constraint(model, consistentRC[i in rows, j in cols, p in colors],
                     sum(y[i,t,k] for t in mSetR[i,p] for k in oSetR[i,t,j])
                     == sum(x[j,t,k] for t in mSetC[j,p] for k in oSetC[j,t,i]))
    

    JuMP.optimize!(model)
    terminationStatus = JuMP.termination_status(model)

    if verbosity>0
        @show JuMP.solution_summary(model)
    end

    zStar = zeros(eltype(palette), length(rows), length(cols))
    if terminationStatus == JuMP.OPTIMAL
        yStar = JuMP.value.(y)
        
        # construct puzzle solution from optimization solution
        for i in rows, j in cols
            for (p, color) in enumerate(palette)
                if 1.0 == sum(yStar[i,t,k]
                              for t in mSetR[i,p] for k in oSetR[i,t,j]; init=0)
                    zStar[i,j] = color
                end
            end
        end
    end
    
    return PuzzleSolution(terminationStatus, zStar, palette)
end

function Base.show(io::IO, solution::PuzzleSolution)
    palette = solution.palette
    if issubset(palette, 1:4)
        printGuide = Dict(0=>"⬜", 1=>"⬛", 2=>"🟩", 3=>"🟦", 4=>"🟪")
    else
        paletteWithZero = [palette; zero(eltype(palette))]
        printGuide = Dict(paletteWithZero .=> paletteWithZero)
    end
    z = solution.z
    
    return begin
        println(io, "")
        for i in 1:size(z,1)
            println(io, [printGuide[z[i,j]] for j in 1:size(z,2)]...)
        end
    end
end

end # module
