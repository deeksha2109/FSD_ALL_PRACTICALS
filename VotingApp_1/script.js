// STEP 1: Initialize votes
let votes = {
  'JavaScript': 0,
  'Python': 0,
  'Java': 0,
  'C++': 0
};

// STEP 2: Function called when user clicks vote button
function vote(language) {
  votes[language]++;
  updateVotes(); // Refresh displayed results
}

// STEP 3: Function to update the results section in HTML
function updateVotes() {
  for (let lang in votes) {
    document.getElementById(lang).textContent = votes[lang];
  }
}

// STEP 4: Simulate other users voting in real-time
setInterval(() => {
  const languages = Object.keys(votes);
  const randomLang = languages[Math.floor(Math.random() * languages.length)];
  votes[randomLang]++;
  updateVotes();
}, 2000); // every 2 seconds
