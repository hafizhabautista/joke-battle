(function () {
  const leftJokeText = document.querySelector("#left-joke .joke-text");
  const rightJokeText = document.querySelector("#right-joke .joke-text");
  const voteLeftBtn = document.getElementById("vote-left");
  const voteRightBtn = document.getElementById("vote-right");

  const currentJokes = {
    left: "",
    right: "",
  };

  const champion = {
    text: "",
    score: 0,
  };

  async function getDadJoke() {
    try {
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      return data?.joke || "Sorry! No joke is returned.";
    } catch (error) {
      console.error("Failed to fetch a joke", error);
      return "Ooops! Sorry, could not fetch a joke";
    }
  }

  function updateChampionUI() {
    document.getElementById("champion-text").textContent = champion.text;
    document.getElementById(
      "champion-score"
    ).innerHTML = `Streak:<br><strong>${champion.score}</strong>`;
    leftJokeText.textContent = champion.text;
  }

  async function handleVote(isRightJokeWinner) {
    if (isRightJokeWinner) {
      champion.text = currentJokes.right;
      champion.score = 1;
    } else {
      champion.score += 1;
    }
    updateChampionUI();
    await loadNewChallenger();
  }

  function handleVoteLeft() {
    handleVote(false);
  }

  function handleVoteRight() {
    handleVote(true);
  }

  async function loadJokes() {
    champion.text = await getDadJoke();
    champion.score = 0;

    let challenger = await getDadJoke();
    while (challenger === champion.text) {
      challenger = await getDadJoke();
    }

    updateChampionUI();

    rightJokeText.textContent = challenger;
    currentJokes.right = challenger;
  }

  async function loadNewChallenger() {
    let newJoke = await getDadJoke();
    while (newJoke === champion.text) {
      newJoke = await getDadJoke();
    }
    rightJokeText.textContent = newJoke;
    currentJokes.right = newJoke;
  }

  voteLeftBtn.addEventListener("click", handleVoteLeft);
  voteRightBtn.addEventListener("click", handleVoteRight);

  loadJokes();
})();
