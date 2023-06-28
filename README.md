# NonogramSolver.jl

[![Stable](https://img.shields.io/badge/docs-stable-blue.svg)](https://kamilkhanlab.github.io/NonogramSolver.jl/stable/)
[![Dev](https://img.shields.io/badge/docs-dev-blue.svg)](https://kamilkhanlab.github.io/NonogramSolver.jl/dev/)
[![Build Status](https://github.com/kamilkhanlab/NonogramSolver.jl/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/kamilkhanlab/NonogramSolver.jl/actions/workflows/CI.yml?query=branch%3Amain)

A module in Julia for formulating and solving [nonogram puzzles](https://en.wikipedia.org/wiki/Nonogram)
(a.k.a. Picross, paint-by-number, and crucipixel). Uses a [new integer
linear programming (ILP)
formulation](https://doi.org/10.1109/TG.2020.3036687), which is solved
through [JuMP](https://jump.dev/JuMP.jl/stable/).

For examples and API details, please see the package's documentation linked above.

If you make use of this implementation in your own work, please cite
the accompanying article:

> Kamil A. Khan, Solving nonograms using integer programming without
> coloring, *IEEE Transactions on Games*, 14(1): 56-63, 2022.
> doi:[10.1109/TG.2020.3036687](https://doi.org/10.1109/TG.2020.3036687)

