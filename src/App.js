// I learned that ContextAPI is very limited in comparison with Redux.
// Redux > ContextAPI

import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { actionTypes, PkmnContext, PkmnProvider } from "./Context";
import { TimelineMax } from "gsap";
import { getColor, typeColors } from "./colors";
import "./styles.scss";

const url = "https://pokeapi.co/api/v2/pokemon/";

const Stat = ({ color, width, dataType, dataValue }) => {
  const styles = {
    backgroundColor: color,
    width: width + "%"
  };
  return (
    <React.Fragment>
      <div className="label">
        {dataType === "special-attack"
          ? "sp. attack"
          : dataType === "special-defense"
          ? "sp. defense"
          : dataType}
        : <span style={{ color: color }}>{dataValue}</span>
      </div>
      <div className="stat-total">
        <div data-value={dataValue} className="stat" style={{ ...styles }} />
      </div>
    </React.Fragment>
  );
};

const Data = () => {
  const [state] = useContext(PkmnContext);
  const { stats } = state.pkmn;
  const calcPercent = (base_stat) => {
    return (base_stat / 255) * 100;
  };
  return (
    <div className="data-container">
      {stats.map((stat) => (
        <Stat
          dataType={stat.stat.name}
          dataValue={stat.base_stat}
          width={calcPercent(stat.base_stat)}
          color={getColor(stat.stat.name)}
        />
      ))}
    </div>
  );
};

const Types = () => {
  const [state] = useContext(PkmnContext);
  const { pkmn } = state;
  return (
    <div className="types">
      {pkmn.types.map((type) => (
        <span
          className="type"
          style={{ backgroundColor: "#" + typeColors[type.type.name] }}
        >
          {type.type.name}
        </span>
      ))}
    </div>
  );
};

const Loader = () => {
  const [state, dispatch] = useContext(PkmnContext);
  const { isLoading } = state;
  const [start, setStart] = useState(false);
  let loader = useRef();
  let range = useRef();
  const tl = useRef();
  useEffect(() => {
    setTimeout(() => {
      setStart(true);
    }, 100);
    if (start) {
      tl.current = new TimelineMax({
        timeScale: 0.5,
        onComplete: () => dispatch({ type: actionTypes.SHOW_INFO })
      })
        .set(loader.current, { autoAlpha: 1 })
        .to(range.current, 3, { width: 100 + "%" });
    }
  }, [start, dispatch]);
  useEffect(() => {
    // Check if animation hasn't started yet but the data has already loaded
    if (!start && !isLoading) {
      dispatch({ type: actionTypes.SHOW_INFO });
    }
    // Speed up the animation when data has loaded
    if (start && !isLoading) {
      tl.current.timeScale(15);
    }
  }, [isLoading, dispatch, start]);
  return (
    <div className="loading">
      <div className="loader" ref={loader}>
        <div className="range" ref={range} />
      </div>
    </div>
  );
};

const Info = ({ pkmn }) => (
  <React.Fragment>
    <div className="id">#{pkmn.id}</div>
    <div className="img-wrapper">
      <img
        className="sprite"
        src={pkmn.sprites.front_default}
        alt={pkmn.name}
      />
    </div>
    <h3 className="name">{pkmn.name}</h3>
    <Types data={pkmn.types} />
  </React.Fragment>
);

const PokeInfo = () => {
  const [state] = useContext(PkmnContext);
  const { pkmn, show } = state;
  return (
    <div className="sprite-container">
      {!show ? <Loader /> : <Info pkmn={pkmn} />}
    </div>
  );
};

const PokemonCard = ({ children }) => {
  return (
    <div id="card">
      {children}
      <PokeInfo />
      <Data />
    </div>
  );
};

const Buttons = () => {
  const [state, dispatch] = useContext(PkmnContext);
  const { isLoading } = state;
  const buttonVals = {
    random: "♻",
    up: "▲",
    down: "▼"
  };
  return (
    <div className="btns">
      {Object.entries(buttonVals).map((pair) => (
        <button
          onClick={() =>
            dispatch({
              type: actionTypes.SET_ID,
              payload: pair[0]
            })
          }
          key={pair[0]}
          disabled={isLoading}
        >
          {pair[1]}
        </button>
      ))}
    </div>
  );
};

const Main = () => {
  const [state, dispatch] = useContext(PkmnContext);
  const { pkmn, id } = state;
  useEffect(() => {
    const fetchPkmn = async () => {
      try {
        dispatch({ type: actionTypes.START_LOADING });
        const res = await axios.get(url + id);
        dispatch({ type: actionTypes.SET_PKMN, payload: res.data});
        dispatch({ type: actionTypes.END_LOADING });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchPkmn();
  }, [id, dispatch]);
  return (
    <div>
      {pkmn && (
        <PokemonCard>
          <Buttons />
        </PokemonCard>
      )}
    </div>
  );
};

const App = () => {
  return (
    <PkmnProvider>
      <Main />
    </PkmnProvider>
  );
};

export default App;
