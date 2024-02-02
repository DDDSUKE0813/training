const parentResult = document.getElementById('parentResult');
const playerNameParent = document.getElementById('playerNameParent');
const parentHand = document.getElementById('parentHand');
const parentFirstCard = document.getElementById('parentFirstCard');
const parentSecondCard = document.getElementById('parentSecondCard');
const parentThirdCard = document.getElementById('parentThirdCard');
const parentFourthCard = document.getElementById('parentFourthCard');
const parentFifthCard = document.getElementById('parentFifthCard');
const start = document.getElementById('start');
const childFirstCard = document.getElementById('childFirstCard');
const childSecondCard = document.getElementById('childSecondCard');
const childThirdCard = document.getElementById('childThirdCard');
const childFourthCard = document.getElementById('childFourthCard');
const childFifthCard = document.getElementById('childFifthCard');
const childHand = document.getElementById('childHand');
const playerNameChild = document.getElementById('playerNameChild');
const childResult = document.getElementById('childResult');

const suitList = [
  "spade",
  "heart",
  "club",
  "diamond"
];
const cardList = [
  {rank: 2, label: '2'},
  {rank: 3, label: '3'},
  {rank: 4, label: '4'},
  {rank: 5, label: '5'},
  {rank: 6, label: '6'},
  {rank: 7, label: '7'},
  {rank: 8, label: '8'},
  {rank: 9, label: '9'},
  {rank: 10, label: '10'},
  {rank: 11, label: 'J'},
  {rank: 12, label: 'Q'},
  {rank: 13, label: 'K'},
  {rank: 14, label: 'A'}
];

document.addEventListener('DOMContentLoaded',function(){
  const inputElements = [parentFirstCard,parentSecondCard,parentThirdCard,parentFourthCard,parentFifthCard,
    childFirstCard,childSecondCard,childThirdCard,childFourthCard,childFifthCard];
  inputElements.forEach(element => {
    element.appendChild(showCardBack());
  })
});

function showCardBack(){
  const img = document.createElement('img');
  img.src = "./images/card_back.png";
  img.alt = "カード裏面";
  return img;
}

start.addEventListener('click',function(){
  const allCards = makeRandomCards();
  let parentCardsSet = [];
  let childCardSet = [];
  parentCardsSet = allCards.slice(0,5);
  childCardSet = allCards.slice(5,10);
  showParentRandomCard(parentCardsSet);
  showChildRandomCard(childCardSet);
  const parentHandResult = checkHand(parentCardsSet);
  const childHandResult = checkHand(childCardSet);
  parentHand.textContent = `役：${handToString(parentHandResult)}`;
  childHand.textContent = `役：${handToString(childHandResult)}`;

  if(parentHandResult > childHandResult){
    parentResult.textContent = "勝ち";
    childResult.textContent = "負け";
    return;
  }
  if(parentHandResult < childHandResult){
    parentResult.textContent = "負け";
    childResult.textContent = "勝ち";
    return;
  }
  if(parentHandResult === 1 && childHandResult ===1){
    sortCard(parentCardsSet);
    sortCard(childCardSet);
    if(parentCardsSet[4].rank > childCardSet[4].rank){
      parentResult.textContent = "勝ち";
      childResult.textContent = "負け";
    }else if(parentCardsSet[4].rank < childCardSet[4].rank){
      parentResult.textContent = "負け";
      childResult.textContent = "勝ち";
    }else{
      parentResult.textContent = "引き分け";
      childResult.textContent = "引き分け";
    }
  }else{
    parentResult.textContent = "引き分け";
    childResult.textContent = "引き分け";
  }
})

function handToString(handResult){
  switch(handResult){
    case 10: return 'ロイヤルフラッシュ';
    case 9: return 'ストレートフラッシュ';
    case 8: return 'フォーオブアカインド';
    case 7: return 'フルハウス';
    case 6: return 'フラッシュ';
    case 5: return 'ストレート';
    case 4: return 'スリーオブアカインド';
    case 3: return 'ツーペア';
    case 2: return 'ワンペア';
    case 1: return 'ハイカード';
  }
}

function makeRandomCards(){
  const minCard = 0;
  const maxCard = 12;
  const maxSuit = 3;
  const minSuit = 0;
  const randomCards = [];
  while(randomCards.length < 10){
    let randomCardNum = Math.floor(Math.random()*(maxCard + 1 - minCard)) + minCard;
    let randomSuitNum = Math.floor(Math.random()*(maxSuit + 1 - minSuit)) + minSuit;
    let card = {
      rank: cardList[randomCardNum].rank,
      label: cardList[randomCardNum].label,
      suit: suitList[randomSuitNum],
      image: `./images/${suitList[randomSuitNum]}_${cardList[randomCardNum].label}.png`
    };
    if(!checkDuplicate(randomCards,card)){
      randomCards.push(card);
    }
  }
  return randomCards;
}

function showParentRandomCard(cardSet){
  const parentElements = [parentFirstCard,parentSecondCard,parentThirdCard,parentFourthCard,parentFifthCard];
  updateCardDisplay(parentElements,cardSet);
}

function showChildRandomCard(cardSet){
  const childElements = [childFirstCard,childSecondCard,childThirdCard,childFourthCard,childFifthCard];
  updateCardDisplay(childElements,cardSet);
}

function checkDuplicate(cards,newCard){
  return cards.some(card=> card.rank === newCard.rank && card.suit === newCard.suit);
}

function updateCardDisplay(cardElements,cards){
  cardElements.forEach((element,index) => {
    const img = document.createElement('img');
    const oldImg = element.querySelector('img');
    element.removeChild(oldImg);
    img.src = cards[index].image;
    img.alt = `${cards[index].suit}の${cards[index].label}`;
    element.appendChild(img);
  });
}

function checkHand(cardSet){
  const pairResult = isPairCard(cardSet);
  sortCard(cardSet);
  if(isFlush(cardSet) && isStraight(cardSet)){
    if(cardSet[4].rank === 14){
      return 10;
    }
    return 9;
  }
  if(pairResult){
    return pairResult;
  }
  if(isFlush(cardSet)){
    return 6;
  }
  if(isStraight(cardSet)){
    return 5;
  }
  return 1;
}


function sortCard(cardSet){
  cardSet.sort(function(a,b){
    return a.rank - b.rank;
  })
}
function isFlush(cardSet){
  return cardSet.every((card,i,array)=> i === 0 || card.suit === array[i -1].suit);
}

function isPairCard(cardSet){
  let rankCounts = {};
  for(let card of cardSet){
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    }
  let pairs = 0;
  let threeOfAKind = 0;
  let fourOfAKind = 0;

  for( let count of Object.values(rankCounts)){
    if(count ===2) pairs++;
    if(count ===3) threeOfAKind++;
    if(count ===4) fourOfAKind++;
  }
  if(fourOfAKind === 1){
    return 8;
  }
  if(threeOfAKind === 1 && pairs === 1){
    return 7;
  }
  if(threeOfAKind === 1){
    return 4;
  }
  if(pairs === 2){
    return 3;
  }
  if(pairs === 1){
    return 2;
  }
  return false;
}

function isStraight(cardSet){
  for(let i = 0; i < 3; ++i){
    if(cardSet[i + 1].rank - cardSet[i].rank !== 1){
      return false;
    }
  }
  return cardSet[4].rank - cardSet[3].rank === 1 || (cardSet[3].rank === 5 && cardSet[4].rank ===14);
}

