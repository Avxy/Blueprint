var nullBook = tao;



function load() {
   
        var newick = Newick.parse("(RAFA, vamos criar 02 graficos:1(TREE:1(esteParaOgame:1),EYE:1(esteParaVisualização)))")
        
        var newickNodes = []
        function buildNewickNodes(node, callback) {
          newickNodes.push(node)
          if (node.branchset) {
            for (var i=0; i < node.branchset.length; i++) {
              buildNewickNodes(node.branchset[i])
            }
          }
        }
        buildNewickNodes(newick)
        
        d3.phylogram.buildRadial('#radialtree', newick, {
          width: 400,
          skipLabels: true
        })
        
        d3.phylogram.build('#phylogram', newick, {
          width: 300,
          height: 400
        });
      }
    