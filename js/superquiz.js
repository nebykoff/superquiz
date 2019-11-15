"use strict"

class SuperQuiz {

    constructor(mainSelector, url) {
        this.getAllElements(mainSelector);

        this.url = url;
        this.current_step = 0;
        this.steps_count = this.steps.length;

        this.showElement(this.steps[0]);
        this.addListeners();
        this.refreshProgress();
        this.combineQuestions();
    }


    getAllElements(mainSelector) {
        this.steps = document.querySelectorAll(mainSelector + ' .sq-step');
        this.current_stepElem = document.querySelector(mainSelector + ' .sq-current_step');
        this.steps_countElem = document.querySelector(mainSelector + ' .sq-steps_count');
        this.progress_line = document.querySelector(mainSelector + ' .sq-progress-line');
        this.next_btn = document.querySelector(mainSelector + ' .sq-next-btn');
        this.prev_btn = document.querySelector(mainSelector + ' .sq-prev-btn');
        this.form = document.querySelector(mainSelector + ' .sq-form');
        this.message = document.querySelector(mainSelector + ' .sq-message');
        this.phone = document.querySelector(mainSelector + ' input[name=phone]');
    }

    addListeners() {
        this.next_btn.onclick = () => {
            this.nextStep();
        };

        this.prev_btn.onclick = () => {
            this.prevStep();
        };
        this.form.addEventListener('submit', this.sendForm.bind(this));
    }

    sendForm(event) {
        event.preventDefault();
        if (this.validateLastStep()) {
            fetch(this.url, {
                    method: 'post',
                    body: new FormData(this.form)
                })
                .then(this.isRequestOK)
                .then((resp) => {
                    resp.text().then((resp) => console.log(resp));
                    // this.showThanksMessage();
                })
                .catch(error => console.log(error));
        }
    }
    
    validateLastStep() {
        if (this.phone.value.length > 0)
            return true;
        else
            return false;
    }

    showThanksMessage() {
        this.message.style.display = 'flex';
    }

    hideThanksMessage() {
        this.message.style.display = 'none';
    }

    isRequestOK(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }

    /**
     * Берет вопрос и добавляет в value каждого ответа для передачи через ajax
     * Так же назначает name для radio-кнопок
     */
    combineQuestions() {
        for (let i = 0; i < this.steps.length; i++) {
            let question = this.steps[i].querySelector('.sq-header').innerHTML.trim();
            let labels = this.steps[i].querySelectorAll('.sq-inputs label');

            for (let j = 0; j < labels.length; j++) {
                let input = labels[j].querySelector('input');
                let answer = labels[j].textContent.trim();
                input.value = question + '\n' + answer;

                let radio = labels[j].querySelector('input[type=radio]');
                radio.name = 'step' + (i + 1);
            }
        }
    }

    //Обновляет данные в прогресс баре
    refreshProgress() {
        this.current_stepElem.innerHTML = this.current_step + 1;
        this.steps_countElem.innerHTML = this.steps_count;
        //Вычислям и устанавливаем пройденные проценты
        this.progress_line.style.width = this.current_step / ((this.steps_count - 1) / 100) + '%';
    }

    //Проверяет выбран ли ответ на текущем шаге
    isAnswerChosen() {
        let radios = this.steps[this.current_step].querySelectorAll('input[type=radio]');
        let result = false;
        radios.forEach(radio => {
            if (radio.checked) {
                result = true;
            }
        });
        return result;
    }

    nextStep() {
        if (this.isAnswerChosen()) {
            if (this.current_step < this.steps_count - 1) {

                this.hideElement(this.steps[this.current_step]);
                this.current_step++;
                this.showElement(this.steps[this.current_step]);
                this.refreshProgress();
            }

            if (this.current_step > 0) {
                this.showElement(this.prev_btn);
            }

            if (this.current_step == this.steps_count - 1) {
                this.hideElement(this.next_btn);
                this.hideElement(this.prev_btn);
            }
        }
    }

    prevStep() {
        if (this.current_step > 0) {
            this.hideElement(this.steps[this.current_step]);
            this.current_step--;
            this.showElement(this.steps[this.current_step]);
            this.refreshProgress();
        }

        if (this.current_step == 0) {
            this.hideElement(this.prev_btn);
        }

        if (this.current_step < this.steps_count - 1) {
            this.showElement(this.next_btn);
        }
    }

    hideElement(element) {
        element.style.display = 'none';
    }

    showElement(element) {
        element.style.display = 'initial';
    }
}

new SuperQuiz('#superquiz1', 'send.php');