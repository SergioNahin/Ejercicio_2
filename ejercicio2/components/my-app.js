import { LitElement, html, css } from 'lit-element';
import { stylePokeAPI } from './css/stylePokeAPI';
export class MyApp extends LitElement {
  static style = stylePokeAPI;
  static properties = {
    pokemons: { type: Array },
    selectedType: { type: String },
    searchValue: { type: String },
    filteredPokemons: { type: Array },
    loanding: { type: Boolean },
    error: { type: String },
  };
  constructor() {
    super();
    this.pokemons = [];
    this.selectedType = '';
    this.searchValue = '';
    this.filteredPokemons = [];
    this.loading = false;
    this.error = null;
  }
  connectedCallback() {
    super.connectedCallback();
    this.featchPokemons();
  }

  async featchPokemons() {
    this.loanding = true;
    this.error = null;
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon/?limit=150'
      );
      if (!response.ok) throw new Error('Error al obtener Pokémon');
      const data = await response.json();
      const pokemonDetails = await Promise.all(
        data.results.map(async pokemon => {
          const res = await fetch(pokemon.url);
          return res.ok ? res.json() : null;
        })
      );
      this.pokemons = pokemonDetails.filter(pokemon => pokemon);
      this.filteredPokemons = [...this.pokemons];
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  handleSearch(event) {
    this.searchValue = event.target.value.toLowerCase();
    this.applyFilters();
  }

  handleFilter(event) {
    this.selectedType = event.target.value;
    this.applyFilters();
  }

  applyFilters() {
    const filtered = this.pokemons.filter(pokemon => {
      const matchesNameOrId =
        pokemon.name.includes(this.searchValue) ||
        pokemon.id.toString() === this.searchValue;
      const matchesType =
        !this.selectedType ||
        pokemon.types.some(type => type.type.name === this.selectedType);
      return matchesNameOrId && matchesType;
    });
    this.filteredPokemons = filtered;
  }

  render() {
    return html`
      <div class="container">
        <h1 class="text-center">Pokémon App</h1>

        <div class="row my-3">
          <div class="col-md-6">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar por ID o nombre"
              @input=${this.handleSearch}
            />
          </div>
          <div class="col-md-6">
            <select class="form-select" @change=${this.handleFilter}>
              <option value="">Filtrar por tipo</option>
              ${[
                'fire',
                'water',
                'grass',
                'electric',
                'rock',
                'ground',
                'psychic',
                'ice',
                'dragon',
                'dark',
                'fairy',
              ].map(type => html`<option value="${type}">${type}</option>`)}
            </select>
          </div>
        </div>

        ${this.loading
          ? html`<p>Cargando Pokémon...</p>`
          : this.error
          ? html`<p>Error: ${this.error}</p>`
          : this.filteredPokemons.length
          ? html`
              <div class="row">
                ${this.filteredPokemons.map(
                  pokemon => html`
                    <div class="col-md-4">
                      <div class="pokemon-card">
                        <h3>${pokemon.name}</h3>
                        <img
                          src="${pokemon.sprites?.front_default ||
                          'https://via.placeholder.com/150'}"
                          alt="${pokemon.name}"
                          class="${pokemon.sprites?.front_default
                            ? ''
                            : 'default-img'}"
                        />
                        <p class="details">Altura: ${pokemon.height / 10} m</p>
                        <p class="details">Peso: ${pokemon.weight / 10} kg</p>
                        <button
                          class="btn btn-primary"
                          @click=${() =>
                            alert(
                              `Habilidades: ${pokemon.abilities
                                .map(ability => ability.ability.name)
                                .join(', ')}`
                            )}
                        >
                          Ver más
                        </button>
                      </div>
                    </div>
                  `
                )}
              </div>
            `
          : html`<p>No se encontraron Pokémon</p>`}
      </div>
    `;
  }
}
