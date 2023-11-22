import PostFakeData from './PostFakeData.json';

const CLICK_CATEGORI = 'categoriModule/CLICK_CATEGORI';

export const seartchCategori = payload => ({
  type: CLICK_CATEGORI,
  payload: payload,
});

const categoriState = [
  {
    id: 1,
    game: 'LEAGUE OF LEGENDS',
    players: 5,
  },
  {
    id: 2,
    game: 'OVERWATCH',
    players: 5,
  },
  {
    id: 3,
    game: 'STARCRAFT',
    players: 8,
  },
  {
    id: 4,
    game: 'ROLLTOCHES',
    players: 8,
  },
  {
    id: 5,
    game: 'VALLOLANT',
    players: 6,
  },
];

const categori = (state = categoriState, action) => {
  switch (action.type) {
    case CLICK_CATEGORI:
      const selectedGame = state.find(categori => categori.id === action.payload);
      const gameFilter = PostFakeData.filter(post => post.category === selectedGame.game);
      return gameFilter;

    default:
      return state;
  }
};

export default categori;
