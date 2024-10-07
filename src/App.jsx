import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import logo from "./assets/img/logo.png";

function App() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [counter, setCounter] = useState();

  const fetchData = async () => {
    const response = await axios.get("http://localhost:3000/");
    // console.log(response.data);
    setData(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [isLoading]);

  let total = 0;
  for (let i = 0; i < content.length; i++) {
    total += content[i].price * content[i].quantity;
  }

  // console.log(data.categories.name);

  return isLoading ? (
    <span>En cours de chargement... </span>
  ) : (
    <>
      <header>
        <div className="container">
          <div>
            <img className="logo" src={logo} />
            <h1>{data.restaurant.name}</h1>
            <p>{data.restaurant.description}</p>
          </div>
          <img
            className="imgage"
            src={data.restaurant.picture}
            alt={data.restaurant.name}
          />
        </div>
      </header>
      <main>
        <div className="container">
          <div className="column-left">
            {data.categories.map((elem) => {
              if (elem.meals.length !== 0) {
                return (
                  <section key={elem.name} className="middle-section">
                    <h2>{elem.name}</h2>
                    <div className="meals-container">
                      {elem.meals.map((meals, id) => {
                        // console.log(meals);

                        return (
                          <article
                            key={meals.id}
                            className="menuItem"
                            onClick={() => {
                              // Si le plat n'est pas dans le panier, je l'ajoute
                              // Sinon si le plat n'est pas dans le panier je l'enregistre 2 fois sans le pusher 2 fois

                              // console.log(meals);
                              const contentCopy = [...content];
                              // METHODE ALGO PURE
                              // let foundMeal;

                              // for (let i = 0; i < content.length; i++) {
                              //   if (content[i].id === meals.id) {
                              //     foundMeal = contentCopy[i];
                              // //   }
                              // }
                              console.log(contentCopy);

                              // METHODE FIND

                              const foundMeal = contentCopy.find(
                                (element) => element.id === meals.id
                              );

                              if (!foundMeal) {
                                contentCopy.push({
                                  id: meals.id,
                                  title: meals.title,
                                  price: meals.price,
                                  quantity: 1,
                                });
                              } else {
                                foundMeal.quantity++;
                              }
                              setContent(contentCopy);
                            }}
                          >
                            <div>
                              <h3>{meals.title}</h3>
                              <p className="description">{meals.description}</p>
                              <div className="info-menu">
                                <p>{meals.price} €</p>
                                {meals.popular && <p>Populaire</p>}
                              </div>
                            </div>

                            {meals.picture && (
                              <img src={meals.picture} alt={meals.title} />
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              }
            })}
          </div>
          <div className="column-right">
            {content.length === 0 ? (
              <button className="validate">Valider mon panier</button>
            ) : (
              <button className="disabled">Valider mon panier</button>
            )}
            <div>
              {content.map((plat, index) => {
                // console.log(meals);
                return (
                  <div className="plat" key={plat.id}>
                    <div className="counters">
                      {counter !== 0 && (
                        <button
                          onClick={() => {
                            const contentCopy = [...content];
                            // console.log(contentCopy[index].quantity);

                            // Si la quantité au moment du clik est de 1, j'enlève le plat du tableau

                            if (contentCopy[index].quantity === 1) {
                              contentCopy.splice(index, 1);
                            } else {
                              contentCopy[index].quantity--;
                            }
                            setContent(contentCopy);
                          }}
                        >
                          -
                        </button>
                      )}
                      <p>{plat.quantity}</p>
                      <button
                        onClick={() => {
                          const contentCopy = [...content];
                          contentCopy[index].quantity++;
                          setContent(contentCopy);
                        }}
                      >
                        +
                      </button>
                      <span>{plat.title}</span>
                    </div>
                    <span>{plat.price}</span>
                  </div>
                );
              })}
              <p className="total">Total : {total.toFixed(2)}</p>
            </div>
            {content.length === 0 ? (
              <div className="empty">Votre panier est vide</div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
