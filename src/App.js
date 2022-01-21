import React from "react";
import "./App.css";
import Graph from "react-graph-vis";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      arity: 2,
      depth: 3,
      qty: 10,
      defaultValues: true,
      defaultGraph: true,
      adjList:
        "[(1, 4), (1, 2), (4, 8), (4, 5), (2, 3), (8, 9), (8, 10), (5, 7), (5, 6)]",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitArity = this.handleSubmitArity.bind(this);
    this.handleSubmitDepth = this.handleSubmitDepth.bind(this);
    this.handleSubmitQty = this.handleSubmitQty.bind(this);
    this.handleGenerateGraph = this.handleGenerateGraph.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
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

  handleGenerateGraph(event) {
    event.preventDefault();
    const requestOptions = {
      method: "PUT",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify([
        parseInt(this.state.arity),
        parseInt(this.state.depth),
        parseInt(this.state.qty),
      ]),
    };

    fetch("http://127.0.0.1:5000/api/v1/getTree", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const value = String(data.val);
        this.setState({
          adjList: value,
          defaultGraph: false,
        });
      });
  }

  handleSubmitArity(event) {
    event.preventDefault();
    const value = this.refs.askArity.value;
    if (!this.isInDesiredForm(value)) {
      alert("La valeur entrée pour l'arité n'est pas valide !");
    } else {
      this.setState({ arity: value, defaultValues: false });
    }
  }

  handleSubmitDepth(event) {
    event.preventDefault();
    const value = this.refs.askDepth.value;
    if (!this.isInDesiredForm(value)) {
      alert("La valeur entrée pour la profondeur n'est pas valide !");
    } else {
      this.setState({ depth: value, defaultValues: false });
    }
  }

  handleSubmitQty(event) {
    event.preventDefault();
    const value = this.refs.askQty.value;
    if (!this.isInDesiredForm(value)) {
      alert("La valeur entrée pour la quantité de sommets n'est pas valide !");
    } else {
      this.setState({ qty: value, defaultValues: false });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Bienvenue à mon générateur d'arbre</p>
        </header>
        <div className="parent flex-parent">
          <div className="child flex-child">
            <h3>Entrez des valeurs:</h3>
            <form onSubmit={this.handleSubmitArity}>
              {" "}
              <label>
                Changer l'arité:
                <input
                  type="text"
                  placeholder={this.state.arity}
                  onChange={this.handleChange}
                  ref="askArity"
                />{" "}
              </label>
              <input type="submit" value="Soumettre" />
            </form>
            <form onSubmit={this.handleSubmitDepth}>
              {" "}
              <label>
                Changer la profondeur:
                <input
                  type="text"
                  placeholder={this.state.depth}
                  onChange={this.handleChange}
                  ref="askDepth"
                />{" "}
              </label>
              <input type="submit" value="Soumettre" />
            </form>
            <form onSubmit={this.handleSubmitQty}>
              {" "}
              <label>
                Changer la quantité de sommets:
                <input
                  type="text"
                  placeholder={this.state.qty}
                  onChange={this.handleChange}
                  ref="askQty"
                />{" "}
              </label>
              <input type="submit" value="Soumettre" />
            </form>

            <button onClick={this.handleGenerateGraph}>
              {" "}
              Générer l'arbre avec ces paramètres{" "}
            </button>
          </div>
          <div className="child flex-child">
            <IsDefaultValues defaultValues={this.state.defaultValues} />
            Valeur actuelle de l'arité: {this.state.arity} <br />
            Valeur actuelle de la profondeur: {this.state.depth}
            <br />
            Valeur actuelle de la quantité de sommets: {this.state.qty}
          </div>
        </div>
        <h2> Liste d'adjacence de l'arbre: </h2>
        {this.state.adjList}
        <IsDefaultGraph defaultGraph={this.state.defaultGraph} />
        <GraphVis adjList={this.state.adjList} />
      </div>
    );
  }
}

function IsDefaultGraph(props) {
  const isDef = props.defaultGraph;
  if (isDef) {
    return <h2> C'est un graphe généré avec les valeurs par défaut </h2>;
  } else {
    return <h2> Wow, vous avez généré un bel arbre !</h2>;
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
