# Directed Force Graph

Using d3 and React to create a graph with a brush selector. 

Interesting features:
  - usePrevious custom hook => allows comparing with a previous value to
    prevent render loops (neat trick!!)
  - horizontal brush
  - selected data points change when contained inside the brush

Also used the ResizeObserver API to efficiently update on resize events.
