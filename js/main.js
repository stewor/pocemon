class Pocemon {
    constructor() {
        this.API_ENDPOINT = "https://api.pokemontcg.io/v1/cards?";
        this.pageSize = 9;
        this.currentPage = null;
        this.srcHidden = "img/poc.jpg";
        this.tabTwo = [];
        this.tempTwo = [];
        this.cards = document.querySelector('[data-cards]');
        this.btn = document.querySelector('[data-btn]');
        this.cardsListner = null;
        this.score = 0;
        this.hit = 0;
        this.tabCardsRan = [];
        this.tabCards = [];
        this.timeGame = 0;
        this.stopInterval = null;
    }
    async fetchCards() {
        let idd = 0;
        const currentPage = Math.floor(Math.random() * 100);
        const endpoint = `${this.API_ENDPOINT}page=${currentPage}&pageSize=${this.pageSize}`
        await fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                data.cards.forEach(da => {
                    this.tabCards.push({
                        id: da.id,
                        imageUrl: da.imageUrl,
                        dataId: idd++,
                        hidden: true,
                        guessed: false,
                        click: false,
                    })
                })
            });

        let tabObject = [];
        this.tabCards.forEach(ta => {
            let objCopy = Object.assign({}, ta);
            tabObject.push(objCopy);
        })
        this.tabTwo = [...this.tabCards, ...tabObject];
        this.putRandomNumber();
    }

    putRandomNumber() {
        let tempTab = [];
        let temp = [];
        for (let i = 0; i < this.pageSize * 2; i++) {
            temp[i] = i;
        }

        for (let i = 0; i < this.pageSize * 2; i++) {
            let ran = Math.floor(Math.random() * temp.length);
            tempTab.push(this.tabTwo[temp[ran]]);
            temp.splice(ran, 1);
        }
        this.tabCardsRan = tempTab;
        setTimeout(() => {
            this.displayCards();
        }, 1000)

    }
    playAgain() {
        location.reload();
    }
    startGameTime = () => {
        this.stopInterval = setInterval(() => {
            this.timeGame++;
            if (this.timeGame <= 60) {
                this.btn.textContent = "Move: " + this.score + " Time: " + this.timeGame + "sek";
            } else {
                this.btn.textContent = `Move:  ${this.score} Time: ${Math.floor(this.timeGame / 60)}min ${this.timeGame % 60}sek`;
            }
        }, 1000)
    }
    checkCard(e) {
        this.tabCardsRan[e.target.dataset.item].hidden = false;
        this.tabCardsRan[e.target.dataset.item].click = false;
        if (this.tempTwo.length === 0) {

            this.tempTwo.push(e.target.dataset.item);
            this.displayCards();
        }
        else if (this.tempTwo.length > 0) {
            this.displayCards();
            setTimeout(() => {
                this.tabCardsRan[this.tempTwo[0]].hidden = true;
                this.tabCardsRan[e.target.dataset.item].hidden = true;
                this.tabCardsRan[e.target.dataset.item].click = false;

                if (this.tabCardsRan[e.target.dataset.item].id === this.tabCardsRan[this.tempTwo[0]].id) {
                    this.hit++;
                    this.score++;
                    this.tabCardsRan[e.target.dataset.item].guessed = true;
                    this.tabCardsRan[this.tempTwo[0]].guessed = true;
                    if (this.hit >= this.pageSize) {
                        clearInterval(this.stopInterval);
                        this.btn.textContent = `Move:  ${this.score} Time: ${Math.floor(this.timeGame / 60)}min ${this.timeGame % 60}sek Play again?`;
                        this.btn.classList.remove('btn_main--off');
                        this.btn.addEventListener('click', this.playAgain)
                    }
                } else {
                    this.score++;
                    this.tabCardsRan[e.target.dataset.item].click = true;
                    this.tabCardsRan[this.tempTwo[0]].click = true;
                }
                this.tempTwo.length = 0;
                this.displayCards();
            }, 1000);
        }
    }
    displayCards() {
        this.cards.innerHTML = "";
        let id = 0;
        this.tabCardsRan.forEach(tab => {
            this.cards.innerHTML += `<div class="main_card " data-id >
                <img src=${tab.hidden ? this.srcHidden : tab.imageUrl} class="main_img ${tab.guessed ? "main_card--guessed" : ""} ${tab.hidden ? "main_card--hidden" : ""} " alt="pocemon" data-item=${id++}>
                </div>`
        })
        this.cardsListner = document.querySelectorAll('[data-id]');
        this.cardsListner.forEach(card => {
            if (this.tabCardsRan[card.children[0].dataset.item].click) {
                card.addEventListener('click', this.checkCard.bind(this));
                card.classList.add('main_card--pointer');
            } else {
                card.removeEventListener('click', this.checkCard.bind(this));
            }

        })
    }
    hiddenFalse = () => {
        this.tabCardsRan.forEach(ta => {
            ta.hidden = false;
        })
        this.btn.removeEventListener('click', this.hiddenFalse);
        this.btn.classList.add('btn_main--off');
        this.displayCards();
        this.startGameTime();
        setTimeout(() => {
            this.tabCardsRan.forEach(ta => {
                ta.hidden = true;
                ta.click = true;
            })
            this.displayCards();
        }, 3000);
    }
    hiddenTrue = () => {
        this.tabCardsRan.forEach(ta => {
            ta.hidden = true;
        })
    }
    startGame() {
        this.btn.addEventListener('click', this.hiddenFalse)
    }
    init() {
        this.fetchCards();
        this.startGame();
    }
}