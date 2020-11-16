var nullBook = tao;



function load() {
   
        var newick = Newick.parse("(TAO:1)")
        
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
    