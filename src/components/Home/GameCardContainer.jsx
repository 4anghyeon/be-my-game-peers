import React from 'react';
import styled, {keyframes} from 'styled-components';
import lolImage from 'assets/img/gameCard/lol.jpg';
import overwatchImage from 'assets/img/gameCard/overwatch.png';
import starcraftImage from 'assets/img/gameCard/starcraft.jpg';
import valorantImage from 'assets/img/gameCard/valorant.png';
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const blink = keyframes`
  0%, 100% {
    color: transparent;
  }
  50% {
    color: white;
  }
`;
const GameCardContainer = ({category}) => {
  let img = '';
  const categoryLetters = category.split('');
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

  return (
    <ScContainer $img={img}>
      <ScCategoryName>{category}</ScCategoryName>
    </ScContainer>
  );
};

const ScContainer = styled.section`
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  width: 80%;
  height: 600px;
  margin-bottom: 20px;
  background-image: url(${({$img}) => $img});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
`;
const ScCategoryName = styled.div`
  position: absolute;
  font-size: 60px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center;
  left: 50%;
  margin: 0 auto;
  transform: translateX(-50%) translateY(80%);
  letter-spacing: 10px;
  animation: ${fadeIn} 0.8s ease-in-out forwards, ${blink} 1.5s infinite;
`;

export default GameCardContainer;
