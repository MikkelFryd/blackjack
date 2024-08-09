import { useEffect, useState } from "react";
import style from "../styles/bjstyle.module.scss";

export const BlackJack = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHandValue, setPlayerHandValue] = useState([]);
  const [dealerHandValue, setDealerHandValue] = useState([]);
  const [playerStay, setPlayerStay] = useState(false);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [dealerTotal, setDealerTotal] = useState(0);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    getDeck();
  }, []);

  const getDeck = async () => {
    const res = await fetch(
      `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
    );
    const data = await res.json();
    setDeck(data);
  };

  const drawCard = async (numCards) => {
    if (playerStay === true) {
      console.log("No draw for player");
    } else {
      const resPlayer = await fetch(
        `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${numCards}`
      );
      const playerData = await resPlayer.json();
      if (numCards === 1) {
        let clonePlayer = [...playerHand];
        clonePlayer.push(...playerData.cards);
        setPlayerHand(clonePlayer);
      } else setPlayerHand(playerData.cards);
    }
    const resDealer = await fetch(
      `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${numCards}`
    );
    const dealerData = await resDealer.json();
    if (numCards === 1) {
      if (playerStay === true) {
        let cloneDealer = [...dealerHand];
        cloneDealer.push(...dealerData.cards);
        setDealerHand(cloneDealer);
      } else return null;
    } else setDealerHand(dealerData.cards);
  };

  const handleWinner = () => {
    if (dealerTotal > 21) {
      setWinner("Dealer busts, Player Wins");
    }
    if (playerTotal > 21) {
      setWinner("Player busts, Dealer Wins");
    }
    if (playerTotal === 20 && dealerTotal === 20) {
      setWinner("Push, Both Wins");
    }
    if (playerTotal === 21 && dealerTotal === 21) {
      setWinner("Push, Both Wins");
    }
    if (dealerTotal === 21) {
      setWinner("Dealer Wins");
    }
    if (playerTotal === 21) {
      setWinner("Player Wins");
    }
    if (playerStay === true) {
      if (playerTotal === dealerTotal) {
        setWinner("Push, Both Wins");
      }
      if (dealerTotal > 21) {
        setWinner("Player Wins");
      }
      if (dealerTotal > playerTotal && dealerTotal < 21) {
        setWinner("Dealer Wins");
      }
    } else return null;
  };

  const handleAce = (arr, total) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 1 | 11) {
        if (total < 21) {
          return i + 10;
        }
      } else return null;
    }
  };

  useEffect(() => {
    if (playerHand !== null) {
      handleAce(playerHand, playerTotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerTotal]);

  useEffect(() => {
    if (dealerHand !== null) {
      handleAce(dealerHand, dealerTotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerTotal]);

  const clearHand = () => {
      setWinner(""),
      setDealerHand([]),
      setDealerHandValue([]),
      setDealerTotal([]),
      setPlayerHand([]),
      setPlayerHandValue([]),
      setPlayerTotal([]),
      setPlayerStay(false);
  };

  useEffect(() => {
    if (playerTotal || dealerTotal !== 0) {
      handleWinner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerTotal, playerTotal]);

  useEffect(() => {
    if (playerHand !== null) {
      handlePlayerValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerHand]);

  useEffect(() => {
    if (dealerHand !== null) {
      handleDealerValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerHand]);

  useEffect(() => {
    handleTotal(playerHandValue, setPlayerTotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerHandValue]);

  useEffect(() => {
    handleTotal(dealerHandValue, setDealerTotal);
  }, [dealerHandValue]);

  const handleTotal = (arr, setter) => {
    let totalValues = arr.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    setter(totalValues);
  };

  const handlePlayerValues = () => {
    let playerArr = playerHand.map((item) => {
      return handleCardValue(item.value, playerTotal);
    });
    setPlayerHandValue(playerArr);
  };

  const handleDealerValues = () => {
    let dealerArr = dealerHand.map((item) => {
      return handleCardValue(item.value, dealerTotal);
    });
    setDealerHandValue(dealerArr);
  };

  const handleCardValue = (value, total) => {
    if (value === "JACK" || value === "QUEEN" || value === "KING") {
      return 10;
    }
    if (value === "ACE") {
      if (total + 11 > 21) {
        return 1;
      } else return 11;
    } else return parseInt(value);
  };

  const handleStay = () => {
    setPlayerStay(true);
  };

  return (
    <main>
      <h1>Blackjack</h1>
      <h2>{winner}</h2>
      <div className={style.btnContainer}>
        <button
          onClick={() =>
            !playerHand.length && !playerStay ? drawCard(2) : drawCard(1)
          }
        >
          {!playerStay ? "Draw Card" : "Dealer Draw Card"}
        </button>
        <button onClick={() => handleStay()}>Stay</button>
        <button onClick={() => clearHand()}>Reset Hands</button>
      </div>
      <section className={style.gameBoard}>
        {playerHand?.length > 0 ? (
          <div className={style.playerBoard}>
            <h3>Player Hand</h3>
            <p>{playerTotal}</p>
            <div className={style.cards}>
              {playerHand.map((item, index) => {
                return <img key={index} src={item.image} alt="" />;
              })}
            </div>
          </div>
        ) : null}
        {dealerHand?.length > 0 ? (
          <div className={style.dealerBoard}>
            <h3>Dealer Hand</h3>
            <p>{dealerTotal}</p>
            <div className={style.cards}>
              {dealerHand.map((item, index) => {
                return <img key={index} src={item.image} alt="" />;
              })}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
};
