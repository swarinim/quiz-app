import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  questions = [];
  currentQuestion = {};
  temp={};
  questionsAnswred = [];
  current=0;
  score=0;

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('question');
    });
  }

  $onInit() {
    function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
    }
    this.$http.get('/api/questions')
      .then(response => {
        this.questions = shuffle(response.data);
        this.currentQuestion = this.questions[0];
        this.temp.correctAnswer = this.questions[0].correctAnswer;
        this.temp.desc = this.questions[0].desc;
        this.socket.syncUpdates('question', this.questions);
      });
  }

  chooseAnswer(answer){
    this.currentQuestion.correctAnswer = this.temp.correctAnswer;
    this.currentQuestion.desc = this.temp.desc;
    document.getElementById('card').classList.remove('off');
    document.getElementById('card').classList.add('on');
    if (this.questionsAnswred.includes(this.currentQuestion._id)) {
      alert("You've already answered this question");
    }
    else {
      this.questionsAnswred.push(this.currentQuestion._id);
      if (answer === this.currentQuestion.correctAnswer) {
        this.score++;
        alert('correct');
      }
      else {
        alert('incorrect');
      }
    }
  }

  nextQuestion(){
    document.getElementById('card').classList.remove('on');
    document.getElementById('card').classList.add('off');

    if (this.current < this.questions.length - 1 ) {
      this.current++;
      this.currentQuestion = _.clone(this.questions[this.current]);
      this.temp.correctAnswer = this.questions[this.current].correctAnswer;
      this.temp.desc = this.questions[this.current].desc;
      if (!this.questionsAnswred.includes(this.currentQuestion._id)) {
      this.currentQuestion.correctAnswer = '';
      this.currentQuestion.desc = '';
      }
      return true;
    }
    return false;
  }

  previousQuestion(){
    document.getElementById('card').classList.remove('on');
    document.getElementById('card').classList.add('off');
    if (this.current > 0) {
      this.current--;
      this.currentQuestion = _.clone(this.questions[this.current]);
      this.temp.correctAnswer = this.questions[this.current].correctAnswer;
      this.temp.desc = this.questions[this.current].desc;
      if (!this.questionsAnswred.includes(this.currentQuestion._id)) {
      this.currentQuestion.correctAnswer = '';
      this.currentQuestion.desc = '';
      }
      return true;
    }
    return false;
  }

  replay(){
    document.getElementById('card').classList.remove('on');
    document.getElementById('card').classList.add('off');
    this.questionsAnswred = [];
    this.current=0;
    this.score=0;
    this.$onInit();
  }

}

export default angular.module('prApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
