import React from "react";
import "./App.css";
import Graph from "react-graph-vis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultValues: true,
      defaultGraph: 0,
      adjList:
        "[(1, 4), (1, 2), (4, 8), (4, 5), (2, 3), (8, 9), (8, 10), (5, 7), (5, 6)]",
      params: [2, 3, 10],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGenerateGraph = this.handleGenerateGraph.bind(this);
    this.handleGenerateGraphGet = this.handleGenerateGraphGet.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const value = event.target.value;
    const id = parseInt(event.target.id);
    const newParams = this.state.params;
    newParams[id] = value;
    if (!this.isInDesiredForm(value)) {
      //alert("La valeur entrée n'est pas valide !");
    } else {
      this.setState({ params: newParams, defaultValues: false });
    }
  }

  isInDesiredForm(str) {
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
  }

  handleGenerateGraphGet(event) {
    event.preventDefault();
    const arityUri = encodeURIComponent(this.state.params[0]);
    const depthUri = encodeURIComponent(this.state.params[1]);
    const qtyUri = encodeURIComponent(this.state.params[2]);
    const url = `https://treeapi-klx5yhxhnq-nn.a.run.app/api/v1/getTree?arity=${arityUri}&depth=${depthUri}&qty=${qtyUri}`;
    const localurl = `http://127.0.0.1:5000/api/v1/getTree?arity=${arityUri}&depth=${depthUri}&qty=${qtyUri}`;
    const requestOptions = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const value = String(data.val);
        if (value.includes("La")) {
          this.setState({ adjList: value, defaultGraph: 2 });
        } else {
          this.setState({
            adjList: value,
            defaultGraph: 1,
          });
        }
      });
  }
  handleGenerateGraph(event) {
    event.preventDefault();
    const requestOptions = {
      method: "PUT",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify([
        parseInt(this.state.params[0]),
        parseInt(this.state.params[1]),
        parseInt(this.state.params[2]),
      ]),
    };

    fetch("http://127.0.0.1:5000/api/v1/putTree", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const value = String(data.val);
        this.setState({
          adjList: value,
          defaultGraph: 1,
        });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Bienvenue à mon générateur d'arbre</p>
          <FontAwesomeIcon icon={faArrowDown} />
        </header>
        <div className="Github">
          <a href="https://github.com/alizeegagnon/ReactTreeVis">
            <img
              loading="lazy"
              width="149"
              height="149"
              src="https://github.blog/wp-content/uploads/2008/12/forkme_left_orange_ff7600.png?resize=149%2C149"
              class="attachment-full size-full"
              alt="Fork me on GitHub"
              data-recalc-dims="1"
            ></img>
          </a>
        </div>
        <div className="parent flex-parent">
          <div className="child flex-child">
            <h3>Entrez des valeurs:</h3>
            <form>
              {" "}
              <label>
                Changer l'arité:
                <input
                  id="0"
                  type="text"
                  placeholder={this.state.params[0]}
                  onChange={this.handleChange}
                  ref="askArity"
                />{" "}
              </label>
            </form>
            <form>
              {" "}
              <label>
                Changer la profondeur:
                <input
                  id="1"
                  type="text"
                  placeholder={this.state.params[1]}
                  onChange={this.handleChange}
                  ref="askDepth"
                />{" "}
              </label>
            </form>
            <form>
              {" "}
              <label>
                Changer la quantité de sommets:
                <input
                  id="2"
                  type="text"
                  placeholder={this.state.params[2]}
                  onChange={this.handleChange}
                  ref="askQty"
                />{" "}
              </label>
            </form>
            <button onClick={this.handleGenerateGraphGet}>
              {" "}
              Générer l'arbre avec ces paramètres{" "}
            </button>
          </div>
          <div className="child flex-child">
            <IsDefaultValues defaultValues={this.state.defaultValues} />
            Valeur actuelle de l'arité: {this.state.params[0]} <br />
            Valeur actuelle de la profondeur: {this.state.params[1]} <br />
            Valeur actuelle de la quantité de sommets: {this.state.params[2]}
          </div>
        </div>
        <h2> Liste d'adjacence de l'arbre: </h2>
        {this.state.adjList}
        <IsDefaultGraph defaultGraph={this.state.defaultGraph} />
        <div className="Graph">
          <GraphVis
            adjList={this.state.adjList}
            defaultGraph={this.state.defaultGraph}
          />
        </div>
      </div>
    );
  }
}

function IsDefaultGraph(props) {
  const isDef = props.defaultGraph;
  if (isDef === 0) {
    return <h2> C'est un graphe généré avec les valeurs par défaut </h2>;
  } else if (isDef === 1) {
    return <h2> Wow, vous avez généré un bel arbre !</h2>;
  } else {
    return <h2> Les valeurs entrées ne peuvent créer de graphe valide !</h2>;
  }
}

function IsDefaultValues(props) {
  const isDef = props.defaultValues;
  if (isDef) {
    return <h3> Valeurs par défaut: </h3>;
  } else {
    return <h3> Les valeurs que vous avec entrées: </h3>;
  }
}
function GraphVis(props) {
  const adjList = props.adjList;
  const defGraph = props.defaultGraph;
  if (defGraph === 2) {
    return <h3>Graphe invalide</h3>;
  }
  var arrayEdges = parseEdges(adjList);
  var arrayNodes = parseTreeNodes(adjList);
  const graph = {
    nodes: arrayNodes,
    edges: arrayEdges,
  };
  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
    },
    height: "500px",
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };

  return (
    <div>
      {" "}
      <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={(network) => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
    </div>
  );
}
function parseTreeNodes(adjList) {
  const myArray = adjList.split(")");
  var arrayNodes = [];
  const len = myArray.length;
  var i = 0;
  while (i < len) {
    i++;
    arrayNodes.push({ id: i, label: "" + i, title: "aaa" });
  }

  return arrayNodes;
}

function parseEdges(adjList) {
  const myArray = adjList.split(")");
  var arrayEdges = [];
  const len = myArray.length;
  var i = 0;
  while (i < len - 1) {
    var edgeStr = myArray[i];
    edgeStr = edgeStr.split("(");
    edgeStr = edgeStr[1].split(",");
    arrayEdges.push({ from: parseInt(edgeStr[0]), to: parseInt(edgeStr[1]) });

    i++;
  }
  return arrayEdges;
}

export default App;
