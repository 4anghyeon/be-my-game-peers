import React from 'react';
import styled from 'styled-components';
import lolImage from 'assets/img/gameCard/lol.jpg';
import overwatchImage from 'assets/img/gameCard/overwatch.png';
import starcraftImage from 'assets/img/gameCard/starcraft.jpg';
import valorantImage from 'assets/img/gameCard/valorant.png';

const GameCardContainer = ({category}) => {
  let img = '';
  switch (category) {
    case 'LEAGUE OF LEGENDS':
      img = lolImage;
      break;
    case 'OVERWATCH':
      img = overwatchImage;
      break;
    case 'STARCRAFT':
      img = starcraftImage;
      break;
    case 'VALLORANT':
      img = valorantImage;
      break;
    default:
      img = valorantImage;
  }

  return <ScContainer $img={img}></ScContainer>;
};

const ScContainer = styled.section`
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  width: 80%;
  height: 300px;
  margin-bottom: 20px;
  background-image: url(${({$img}) => $img});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
`;

export default GameCardContainer;
