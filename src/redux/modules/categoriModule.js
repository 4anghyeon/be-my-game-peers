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
    game: 'VALLORANT',
    players: 5,
  },
];

const categori = (state = categoriState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default categori;
