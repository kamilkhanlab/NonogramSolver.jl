using NonogramSolver
using Documenter

DocMeta.setdocmeta!(NonogramSolver, :DocTestSetup, :(using NonogramSolver); recursive=true)

makedocs(;
    modules=[NonogramSolver],
    authors="Kamil A. Khan",
    repo="https://github.com/kamilkhanlab/NonogramSolver.jl/blob/{commit}{path}#{line}",
    sitename="NonogramSolver.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://kamilkhanlab.github.io/NonogramSolver.jl",
        edit_link="main",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
        "API library" => "library.md",
    ],
)

deploydocs(;
    repo="github.com/kamilkhanlab/NonogramSolver.jl",
    devbranch="main",
)
