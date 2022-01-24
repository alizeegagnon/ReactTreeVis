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
      maxParams: [5, 10, 99],
      prod: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGenerateGraph = this.handleGenerateGraph.bind(this);

    this.callApiForMax();
  }

  handleChange(event) {
    event.preventDefault();
    const value = event.target.value;
    const id = parseInt(event.target.id);
    const newParams = this.state.params;
    newParams[id] = value;
    if (!isInDesiredForm(value)) {
      //alert("La valeur entrée n'est pas valide !");
    } else {
      this.setState({ params: newParams, defaultValues: false });
    }
  }

  createUrl() {
    const arityUri = encodeURIComponent(this.state.params[0]);
    const depthUri = encodeURIComponent(this.state.params[1]);
    const qtyUri = encodeURIComponent(this.state.params[2]);
    const URI = `arity=${arityUri}&depth=${depthUri}&qty=${qtyUri}`;
    const APIurl = `https://treeapi-klx5yhxhnq-nn.a.run.app/api/v1/getTree?${URI}`;
    const localurl = `http://192.168.1.176:8080/api/v1/getTree?${URI}`;
    var url = "";
    if (this.state.prod) {
      url = APIurl;
    } else {
      url = localurl;
    }
    return url;
  }

  CreateApiParamsAndCallApi() {
    const url = this.createUrl();
    const requestOptions = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };
    this.callApi(url, requestOptions);
  }

  callApi(url, options) {
    fetch(url, options)
      .then(
        (response) => {
          if (response.ok) {
            return response.json();
          } else {
            return { val: "Les valeurs entrées sont trop grandes" };
          }
        },
        () => console.log("Network error with the API request at " + url)
      )
      .then(
        (data) => this.parseData(data),
        () => console.log("JSON incorrect")
      );
  }

  createUrlForMax() {
    const APIurl =
      "https://treeapi-klx5yhxhnq-nn.a.run.app/api/v1/getMaxParams";
    const localurl = "http://192.168.1.176:8080/api/v1/getMaxParams";
    var url = "";
    if (this.state.prod) {
      url = APIurl;
    } else {
      url = localurl;
    }
    return url;
  }

  callApiForMax() {
    const url = this.createUrlForMax();
    const requestOptions = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };

    fetch(url, requestOptions)
      .then(
        (response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.log("Erreur en essayant de récupérer les valeurs maximum");
          }
        },
        () => {
          console.log("Network error");
        }
      )
      .then((data) => {
        this.setState({ maxParams: data.params });
      });
  }

  parseData(data) {
    const value = String(data.val);
    if (value.includes("L")) {
      this.setState({
        adjList: value,
        defaultGraph: 2,
      });
    } else {
      this.setState({
        adjList: value,
        defaultGraph: 1,
      });
    }
  }

  handleGenerateGraph(event) {
    event.preventDefault();
    this.CreateApiParamsAndCallApi();
  }

  render() {
    return (
      <div className="App">
        <Headers />
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
            <button onClick={this.handleGenerateGraph}>
              {" "}
              Générer l'arbre avec ces paramètres{" "}
            </button>
          </div>
          <div className="child flex-child">
            <IsDefaultValues defaultValues={this.state.defaultValues} />
            Valeur actuelle de l'arité: {this.state.params[0]}. Maximum:{" "}
            {this.state.maxParams[0]}
            <br />
            Valeur actuelle de la profondeur: {this.state.params[1]}. Maximum:{" "}
            {this.state.maxParams[1]}
            <br />
            Valeur actuelle de la quantité de sommets: {this.state.params[2]} .
            Maximum: {this.state.maxParams[2]}
          </div>
        </div>
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

function Headers() {
  return (
    <div>
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
            className="attachment-full size-full"
            alt="Fork me on GitHub"
            data-recalc-dims="1"
          ></img>
        </a>
      </div>
    </div>
  );
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
    return (
      <div>
        {adjList}
        <IsDefaultGraph defaultGraph={defGraph} />
      </div>
    );
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
      <h2> Liste d'adjacence de l'arbre: </h2>
      {adjList}
      <IsDefaultGraph defaultGraph={defGraph} />
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

function isInDesiredForm(str) {
  str = str.trim();
  if (!str) {
    return false;
  }
  str = str.replace(/^0+/, "") || "0";
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n > 0;
}

export let isInDesiredForm = isInDesiredForm;

export default App;
