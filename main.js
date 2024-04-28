fetch("https://pokeapi.co/api/v2/pokemon")
.then(response => response.json())
.then(respJSON=>{
    console.log('respuesta usuariosJSON : ', respJSON)
    for(index = 0; index <5; index++){
        console.log('respuesta usuarios : ', respJSON.results[index].name)
    }
    
})
.catch(error=>console.error('error:', error))



fetch("https://raw.githubusercontent.com/PokeAPI")
.then(response => response.json())
.then(respJSON=>{
    console.log('respuesta usuariosJSON : ', respJSON)
    for(index = 0; index <5; index++){
        console.log('respuesta usuarios : ', respJSON.results[index].name)
    }
    
})
.catch(error=>console.error('error:', error))


//Exercici 2.1 Async/Await
async function obtenerDatosPokemon() {
    try {
      const startTime = performance.now(); // Iniciar el contador de tiempo
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12");
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los Pokémon");
      }
      const data = await response.json();
      const pokemonList = await Promise.all(data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) {
          throw new Error(`Error al obtener los datos del Pokémon ${pokemon.name}`);
        }
        const pokemonData = await pokemonResponse.json();
        return {
          name: pokemonData.name,
          id: pokemonData.id,
          types: pokemonData.types.map(type => type.type.name),
          weight: pokemonData.weight,
          height: pokemonData.height,
          sprites: pokemonData.sprites
        };
      }));
      const endTime = performance.now(); // Finalizar el contador de tiempo
      const tiempoTranscurrido = Math.round(endTime - startTime); // Calcular el tiempo transcurrido
      return { pokemonList, tiempoTranscurrido }; // Retornar también el tiempo transcurrido
    } catch (error) {
      console.error("Error:", error);
      return { pokemonList: [], tiempoTranscurrido: 0 }; // Devolver un objeto con un array vacío y tiempo 0 en caso de error
    }
  }
  
  function mostrarPokemon(cardsData) {
    const container = document.querySelector('.rows');
    container.innerHTML = ''; // Limpiar contenido anterior
    
    cardsData.forEach(pokemon => {
      const cardCol = document.createElement('div');
      cardCol.classList.add('col-md-2');
    
      const cardHTML = `
        <div class="card shadow">
          <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="card-img-top" alt="${pokemon.name}">
          <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5>
            <div class="card-text">ID: ${pokemon.id}</div>
            <div class="card-text">Tipo(s): ${pokemon.types.join(', ')}</div>
            <div class="card-text">Peso: ${pokemon.weight}</div>
            <div class="card-text">Altura: ${pokemon.height}</div>
          </div>
        </div>
      `;
      
      cardCol.innerHTML = cardHTML;
      container.appendChild(cardCol);
    });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const primerBoton = document.getElementById('primerBoton');
    primerBoton.addEventListener('click', async function() {
      try {
        const { pokemonList, tiempoTranscurrido } = await obtenerDatosPokemon();
        mostrarPokemon(pokemonList);
        primerBoton.querySelector('div:last-child').textContent = `TIEMPO: ${tiempoTranscurrido.toFixed(2)} milisegundos`; // Actualizar el texto del tiempo en el botón
      } catch (error) {
        console.error('Error al obtener los datos de los Pokémon:', error);
      }
    });
  });


  // Exercici 2.2 .then/.catch/.finally
  function obtenerDatosPokemonEncadenado() {
    const startTime = performance.now(); // Iniciar el contador de tiempo
    return fetch("https://pokeapi.co/api/v2/pokemon?limit=12")
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos de los Pokémon");
        }
        return response.json();
      })
      .then(data => {
        const promises = data.results.map(pokemon => {
          return fetch(pokemon.url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error al obtener los datos del Pokémon ${pokemon.name}`);
              }
              return response.json();
            });
        });
        return Promise.all(promises)
          .then(pokemonData => {
            const endTime = performance.now(); // Finalizar el contador de tiempo
            const tiempoTranscurrido = Math.round(endTime - startTime); // Calcular el tiempo transcurrido
            return { pokemonList: pokemonData, tiempoTranscurrido }; // Retornar también el tiempo transcurrido
          });
      })
      .catch(error => {
        console.error("Error:", error);
        return { pokemonList: [], tiempoTranscurrido: 0 }; // Devolver un objeto con un array vacío y tiempo 0 en caso de error
      });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const segundoBoton = document.getElementById('segundoBoton');
    segundoBoton.addEventListener('click', function() {
      obtenerDatosPokemonEncadenado()
        .then(({ pokemonList, tiempoTranscurrido }) => {
          mostrarPokemon(pokemonList);
          segundoBoton.querySelector('div:last-child').textContent = `TIEMPO: ${tiempoTranscurrido.toFixed(2)} milisegundos`; // Actualizar el texto del tiempo en el botón
        })
        .catch(error => {
          console.error('Error al obtener los datos de los Pokémon:', error);
        });
    });
  });

  // Exercici 2.3 Promise.All
  function obtenerDatosPokemonSimultaneo() {
    const startTime = performance.now(); // Iniciar el contador de tiempo
    const pokemonPromises = [];
  
    return fetch("https://pokeapi.co/api/v2/pokemon?limit=12")
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos de los Pokémon");
        }
        return response.json();
      })
      .then(data => {
        data.results.forEach(pokemon => {
          pokemonPromises.push(
            fetch(pokemon.url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Error al obtener los datos del Pokémon ${pokemon.name}`);
                }
                return response.json();
              })
          );
        });
  
        return Promise.all(pokemonPromises)
          .then(pokemonData => {
            const endTime = performance.now(); // Finalizar el contador de tiempo
            const tiempoTranscurrido = Math.round(endTime - startTime); // Calcular el tiempo transcurrido
            return { pokemonList: pokemonData, tiempoTranscurrido }; // Retornar también el tiempo transcurrido
          });
      })
      .catch(error => {
        console.error("Error:", error);
        return { pokemonList: [], tiempoTranscurrido: 0 }; // Devolver un objeto con un array vacío y tiempo 0 en caso de error
      });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const tercerBoton = document.getElementById('tercerBoton');
    tercerBoton.addEventListener('click', function() {
      obtenerDatosPokemonSimultaneo()
        .then(({ pokemonList, tiempoTranscurrido }) => {
          mostrarPokemon(pokemonList);
          tercerBoton.querySelector('div:last-child').textContent = `TIEMPO: ${tiempoTranscurrido.toFixed(2)} milisegundos`; // Actualizar el texto del tiempo en el botón
        })
        .catch(error => {
          console.error('Error al obtener los datos de los Pokémon:', error);
        });
    });
  });