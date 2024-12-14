import { css } from "lit";

export const stylePokeAPI = css`
  :host {
      display: block;
      font-family: Arial, sans-serif;
      padding: 16px;
    }
    .pokemon-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    img {
      max-width: 150px;
    }
    .default-img {
      max-width: 150px;
      opacity: 0.5;
    }
    .details {
      margin-top: 8px;
      font-size: 14px;
    }

`;